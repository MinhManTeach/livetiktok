/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Express server: serves the Vite app, relays TikTok LIVE events
 * (chat, gift, like, member, follow, share) to browsers via Server-Sent Events,
 * mirrors the Dashboard's temple state to the OBS overlay (?view=overlay),
 * and lists the background music files in public/music.
 */

import 'dotenv/config';
import express, { Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import {
  TikTokLiveConnection,
  WebcastEvent,
  ControlEvent,
  UserOfflineError,
  InvalidResponseCompositeError,
} from 'tiktok-live-connector';
import type { TikTokLiveEvent, MusicTrack } from './src/types';

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';

const app = express();
app.use(express.json({ limit: '1mb' }));

// ---------- SSE channels ----------
// Each channel replays its latest "sticky" message to clients that (re)connect.
const createSseChannel = (route: string) => {
  const clients = new Set<Response>();
  let sticky: string | null = null;

  app.get(route, (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();
    if (sticky) res.write(sticky);
    clients.add(res);
    const ping = setInterval(() => res.write(': ping\n\n'), 25000);
    req.on('close', () => {
      clearInterval(ping);
      clients.delete(res);
    });
  });

  return (data: unknown, keep = false) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    if (keep) sticky = payload;
    for (const res of clients) res.write(payload);
  };
};

const sendTikTok = createSseChannel('/api/tiktok/events');
let status: TikTokLiveEvent = { type: 'status', state: 'disconnected', timestamp: Date.now() };

const broadcast = (event: TikTokLiveEvent) => {
  if (event.type === 'status') status = event;
  sendTikTok(event, event.type === 'status');
};
broadcast(status);

const setStatus = (state: 'connecting' | 'connected' | 'disconnected', message?: string, uniqueId?: string) =>
  broadcast({ type: 'status', state, message, uniqueId, timestamp: Date.now() });

// ---------- Overlay sync (Dashboard -> OBS overlay) ----------
const sendOverlay = createSseChannel('/api/overlay/events');

app.post('/api/overlay/state', (req, res) => {
  sendOverlay(req.body, true);
  res.json({ ok: true });
});

// Custom background uploaded on the Dashboard, so OBS (a separate browser) can load it too.
let background: { type: string; data: Buffer } | null = null;

app.post('/api/overlay/background', express.raw({ type: 'image/*', limit: '20mb' }), (req, res) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    res.status(400).json({ ok: false, error: 'Ảnh không hợp lệ' });
    return;
  }
  background = { type: req.get('Content-Type') ?? 'image/jpeg', data: req.body };
  res.json({ ok: true, url: `/api/overlay/background?v=${Date.now()}` });
});

app.get('/api/overlay/background', (_req, res) => {
  if (!background) {
    res.sendStatus(404);
    return;
  }
  res.type(background.type).send(background.data);
});

// ---------- Background music (drop audio files into public/music) ----------
const musicDir = path.resolve(import.meta.dirname, 'public', 'music');
const MUSIC_EXTS = new Set(['.mp3', '.m4a', '.aac', '.ogg', '.wav']);

// Served directly (not via dist) so files added after a production build still show up
app.use('/music', express.static(musicDir));

app.get('/api/music', async (_req, res) => {
  const files = await fs.readdir(musicDir).catch(() => [] as string[]);
  const tracks: MusicTrack[] = files
    .filter((f) => MUSIC_EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'vi'))
    .map((f) => ({ name: path.parse(f).name, url: `/music/${encodeURIComponent(f)}` }));
  res.json(tracks);
});

// ---------- TikTok connection ----------
let connection: TikTokLiveConnection | null = null;

type LiveUser = { displayId?: string; nickname?: string; avatarThumb?: { urlList?: string[] } };
const userOf = (data: { user?: LiveUser }) => ({
  uniqueId: data.user?.displayId ?? '',
  nickname: data.user?.nickname || data.user?.displayId || 'Ẩn danh',
  avatar: data.user?.avatarThumb?.urlList?.[0],
});

const disconnectCurrent = async () => {
  const conn = connection;
  connection = null;
  if (conn) {
    conn.removeAllListeners();
    await conn.disconnect().catch(() => undefined);
  }
};

app.post('/api/tiktok/connect', async (req, res) => {
  const uniqueId = String(req.body?.uniqueId ?? '').trim().replace(/^@/, '');
  if (!uniqueId) {
    res.status(400).json({ ok: false, error: 'Thiếu @ID kênh TikTok' });
    return;
  }

  await disconnectCurrent();
  const conn = new TikTokLiveConnection(uniqueId, {
    // Fetching the room gift list needs a paid Euler Stream plan; gift name/diamonds already come in each GIFT event.
    enableExtendedGiftInfo: false,
    processInitialData: false,
    signApiKey: process.env.EULER_API_KEY || undefined,
  });
  connection = conn;
  setStatus('connecting', undefined, uniqueId);

  conn.on(WebcastEvent.CHAT, (data) => {
    broadcast({ type: 'chat', ...userOf(data), comment: data.content ?? '', timestamp: Date.now() });
  });

  conn.on(WebcastEvent.GIFT, (data) => {
    // Streakable gifts (type 1) fire repeatedly; only count the final event of the streak.
    if (data.gift?.type === 1 && !data.repeatEnd) return;
    const repeatCount = Number(data.repeatCount) || 1;
    const unitCoins = Number(data.gift?.diamondCount) || 1;
    broadcast({
      type: 'gift',
      ...userOf(data),
      giftName: data.gift?.name || `Quà #${data.giftId}`,
      repeatCount,
      coins: unitCoins * repeatCount,
      timestamp: Date.now(),
    });
  });

  conn.on(WebcastEvent.LIKE, (data) => {
    broadcast({ type: 'like', ...userOf(data), likeCount: Number(data.count) || 1, timestamp: Date.now() });
  });
  conn.on(WebcastEvent.MEMBER, (data) => broadcast({ type: 'member', ...userOf(data), timestamp: Date.now() }));
  conn.on(WebcastEvent.FOLLOW, (data) => broadcast({ type: 'follow', ...userOf(data), timestamp: Date.now() }));
  conn.on(WebcastEvent.SHARE, (data) => broadcast({ type: 'share', ...userOf(data), timestamp: Date.now() }));

  conn.on(WebcastEvent.STREAM_END, () => {
    if (connection === conn) setStatus('disconnected', 'Buổi live đã kết thúc', uniqueId);
  });
  conn.on(ControlEvent.DISCONNECTED, () => {
    if (connection === conn) setStatus('disconnected', 'Mất kết nối với TikTok', uniqueId);
  });
  conn.on(ControlEvent.ERROR, (err) => {
    console.error('[TikTok] error', err);
  });

  try {
    const state = await conn.connect();
    if (connection !== conn) return;
    setStatus('connected', `Room ID ${state.roomId}`, uniqueId);
    res.json({ ok: true, roomId: state.roomId });
  } catch (err) {
    console.error('[TikTok] connect failed', err instanceof Error ? err.message : err);
    const message =
      err instanceof UserOfflineError || err instanceof InvalidResponseCompositeError
        ? `Kênh @${uniqueId} hiện không live hoặc sai ID`
        : err instanceof Error
          ? err.message
          : String(err);
    if (connection === conn) {
      connection = null;
      setStatus('disconnected', message, uniqueId);
    }
    res.status(502).json({ ok: false, error: message });
  }
});

app.post('/api/tiktok/disconnect', async (_req, res) => {
  const uniqueId = status.uniqueId;
  await disconnectCurrent();
  setStatus('disconnected', 'Đã ngắt kết nối', uniqueId);
  res.json({ ok: true });
});

// ---------- Frontend ----------
if (isProd) {
  const dist = path.resolve(import.meta.dirname, 'dist');
  app.use(express.static(dist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Thiền Đường Tịnh Tâm đang chạy tại http://localhost:${PORT}`);
});
