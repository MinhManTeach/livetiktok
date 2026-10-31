import React, { useState, useEffect } from 'react';
import { OverlayState } from '../types';
import { TempleOverlay916 } from './TempleOverlay916';
import { TEMPLE_THEMES, INITIAL_DEVOTEES } from '../data/templeThemes';

// Shown until the Dashboard publishes its first state snapshot
const FALLBACK_STATE: OverlayState = {
  devotees: INITIAL_DEVOTEES,
  maxSlots: 36,
  incenseCount: 7,
  meritTotal: 254,
  meritList: [
    {
      id: '1',
      nickname: 'Đế Chinvn',
      giftName: 'Hoa Sen Vàng',
      coins: 19,
      prayer: 'Cầu gia đình bình an',
      timestamp: Date.now(),
    },
    {
      id: '2',
      nickname: 'HungDat',
      giftName: 'Nén Tâm Hương',
      coins: 9,
      prayer: 'Nguyện cầu an lạc',
      timestamp: Date.now(),
    },
    {
      id: '3',
      nickname: 'Tôi nghèo',
      giftName: 'Hoa Hồng',
      coins: 7,
      prayer: 'Sám hối nghiệp chướng',
      timestamp: Date.now(),
    },
  ],
  currentTheme: TEMPLE_THEMES[0],
  lastAction: null,
};

/**
 * OBS / TikTok LIVE Studio overlay: mirrors the Dashboard's state via /api/overlay/events.
 * Sound is off by default (the Dashboard plays audio via Desktop Audio); add &sound=1 to enable.
 * The toolbar starts hidden so it never shows on stream; hover the top-right corner to reveal it.
 */
export const LiveOverlay: React.FC = () => {
  const [state, setState] = useState<OverlayState>(FALLBACK_STATE);
  // Wait for the Dashboard's real state before drawing, so a reload doesn't flash the sample scene on stream
  const [ready, setReady] = useState(false);
  const soundOn = new URLSearchParams(window.location.search).get('sound') === '1';

  useEffect(() => {
    const fallbackTimer = setTimeout(() => setReady(true), 2000);
    const es = new EventSource('/api/overlay/events');
    es.onmessage = (e) => {
      const next = JSON.parse(e.data) as OverlayState;
      setReady(true);
      setState((prev) => ({
        ...next,
        // Every snapshot is a fresh object; keep the old action unless it is really new,
        // otherwise the overlay would replay the last effect on each update.
        lastAction:
          prev.lastAction && next.lastAction && prev.lastAction.timestamp === next.lastAction.timestamp
            ? prev.lastAction
            : next.lastAction,
      }));
    };
    return () => {
      clearTimeout(fallbackTimer);
      es.close();
    };
  }, []);

  if (!ready) return <div className="w-full h-full bg-black" />;

  return (
    <TempleOverlay916
      devotees={state.devotees}
      maxSlots={state.maxSlots}
      incenseCount={state.incenseCount}
      meritTotal={state.meritTotal}
      meritList={state.meritList}
      currentTheme={state.currentTheme}
      customBgUrl={state.customBgUrl}
      lastAction={state.lastAction}
      isStandalone={true}
      initialSoundEnabled={soundOn}
      initialToolbarVisible={false}
      mode={state.mode ?? 'chua'}
    />
  );
};
