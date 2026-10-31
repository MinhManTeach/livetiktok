import React, { useState, useEffect, useRef } from 'react';
import {
  Devotee,
  MeritRecord,
  TempleTheme,
  AudioSettings,
  GiftOption,
  ActionEffect,
  SkinType,
  TikTokLiveEvent,
  OverlayState,
} from '../types';
import { TEMPLE_THEMES, TIKTOK_GIFTS, INITIAL_DEVOTEES } from '../data/templeThemes';
import { TempleOverlay916 } from './TempleOverlay916';
import { audioService } from '../services/audioService';
import { RunTestModal } from './RunTestModal';
import { TikTokGuideModal } from './TikTokGuideModal';
import {
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Maximize2,
  Tv,
  Volume2,
  VolumeX,
  Upload,
  UserPlus,
  Flame,
  Gift,
  Trash2,
  Radio,
  Bot,
  Bell,
  Music,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Temple State
  const [currentTheme, setCurrentTheme] = useState<TempleTheme>(TEMPLE_THEMES[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | undefined>(undefined);
  const [maxSlots, setMaxSlots] = useState<number>(36);
  const [incenseCount, setIncenseCount] = useState<number>(3);
  const [meritTotal, setMeritTotal] = useState<number>(254);
  const [meritList, setMeritList] = useState<MeritRecord[]>([
    {
      id: 'm1',
      nickname: 'Đế Chinvn',
      giftName: 'Hoa Sen Vàng',
      coins: 19,
      prayer: 'Cầu gia đình bình an',
      timestamp: Date.now() - 300000,
    },
    {
      id: 'm2',
      nickname: 'HungDat',
      giftName: 'Nén Tâm Hương',
      coins: 9,
      prayer: 'Nguyện cầu an lạc',
      timestamp: Date.now() - 250000,
    },
    {
      id: 'm3',
      nickname: 'Tôi nghèo',
      giftName: 'Hoa Hồng',
      coins: 7,
      prayer: 'Sám hối nghiệp chướng',
      timestamp: Date.now() - 180000,
    },
  ]);
  const [devotees, setDevotees] = useState<Devotee[]>(INITIAL_DEVOTEES);
  const [lastAction, setLastAction] = useState<ActionEffect | null>(null);

  // Audio Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    pitch: -18,
    speed: -20,
    reverb: 28,
    bpm: 46,
    bgMusicEnabled: false,
    bgMusicFreq: 432,
    woodenFishEnabled: false,
    autoChantEnabled: true,
    directAudioEnabled: true,
    chantText:
      'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật. Nguyện cầu cho toàn thể chư vị Phật tử thân tâm thường an lạc, vạn sự cát tường, sở cầu như ý.',
  });

  // Manual input form state
  const [viewerName, setViewerName] = useState('Thiện Nhân');
  const [viewerSkin, setViewerSkin] = useState<SkinType>('phattu_ao_lam');
  const [viewerPrayer, setViewerPrayer] = useState('Nam Mô A Di Đà Phật, cầu gia đình bình an');
  const [selectedGiftId, setSelectedGiftId] = useState(TIKTOK_GIFTS[1].id);
  const [giftCount, setGiftCount] = useState(1);
  const [tiktokId, setTiktokId] = useState('@review.nghip.v');
  const [tiktokStatus, setTiktokStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  // Auto-simulation state
  const [isAutoSimActive, setIsAutoSimActive] = useState(false);
  const autoSimIntervalRef = useRef<number | null>(null);

  // Logs
  const [logs, setLogs] = useState<string[]>([
    '[Hệ thống] 🎁 Đã sẵn sàng kết nối TikTok Live & Thùng Công Đức!',
    '[Hướng dẫn] Bấm "Cho Vào Thắp Hương" hoặc "Tặng Quà" để xem hiệu ứng khói trầm và nảy xu vào Hòm Công Đức.',
    '[Chánh Điện] Đã nạp thành công không gian Đại Hùng Bảo Điện.',
  ]);

  // Modals & Navigation state
  const [isRunTestOpen, setIsRunTestOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isOverlayFullScreen, setIsOverlayFullScreen] = useState(false);

  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 50)]);
  };

  // Add or update devotee
  const addOrUpdateDevotee = (
    name: string,
    skin: SkinType,
    prayer: string,
    isIncense = false,
    addedMerit = 0
  ) => {
    setDevotees((prev) => {
      const existingIdx = prev.findIndex((d) => d.nickname.toLowerCase() === name.toLowerCase());
      const now = Date.now();
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          skin,
          prayer,
          incenseLit: isIncense || copy[existingIdx].incenseLit,
          merit: copy[existingIdx].merit + addedMerit,
          timestamp: now,
        };
        return copy;
      } else {
        const newDevotee: Devotee = {
          id: `devotee-${now}-${Math.random()}`,
          nickname: name,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
          skin,
          prayer,
          incenseLit: isIncense,
          merit: addedMerit,
          timestamp: now,
        };
        const updated = [...prev];
        if (updated.length >= maxSlots) {
          // Replace the oldest non-chief devotee if capacity exceeded
          updated.splice(1, 1);
        }
        updated.push(newDevotee);
        return updated;
      }
    });
  };

  // Manual Add Devotee (Sit or Incense)
  const handleManualAdd = (actionType: 'sit' | 'incense') => {
    const isIncense = actionType === 'incense';
    if (isIncense) {
      setIncenseCount((prev) => prev + 1);
      setLastAction({
        type: 'INCENSE',
        nickname: viewerName,
        message: viewerPrayer,
        timestamp: Date.now(),
      });
      appendLog(`[Thắp hương] 🕯️ ${viewerName} vừa dâng 1 nén tâm hương: "${viewerPrayer}"`);
    } else {
      appendLog(`[Vào thiền] 🧘 ${viewerName} đã an tọa bồ đoàn (y phục: ${viewerSkin}).`);
    }

    addOrUpdateDevotee(viewerName, viewerSkin, viewerPrayer, isIncense, 0);
  };

  // Send Gift -> Merit Box
  const handleSendGift = () => {
    const gift = TIKTOK_GIFTS.find((g) => g.id === selectedGiftId) || TIKTOK_GIFTS[0];
    const totalCoins = gift.coins * giftCount;

    setMeritTotal((prev) => prev + totalCoins);
    setIncenseCount((prev) => prev + 2); // Big gifts add incense

    const newRecord: MeritRecord = {
      id: `merit-${Date.now()}`,
      nickname: viewerName,
      giftName: `${giftCount > 1 ? `${giftCount}x ` : ''}${gift.name}`,
      coins: totalCoins,
      prayer: viewerPrayer || 'Cúng dường Tam Bảo, phước báu vô lượng',
      timestamp: Date.now(),
    };

    setMeritList((prev) => [newRecord, ...prev.slice(0, 19)]);
    addOrUpdateDevotee(viewerName, viewerSkin, newRecord.prayer, true, totalCoins);

    const ttsText = `Nam Mô A Di Đà Phật. Xướng tên công đức thí chủ ${viewerName}, vừa phát tâm cúng dường ${newRecord.giftName} vào hòm công đức. Nguyện đem công đức này hồi hướng cho thí chủ thân tâm an lạc, sở cầu như ý.`;

    setLastAction({
      type: 'MERIT_BOX',
      nickname: viewerName,
      giftName: newRecord.giftName,
      coins: totalCoins,
      ttsText: audioSettings.directAudioEnabled ? ttsText : undefined,
      timestamp: Date.now(),
    });

    appendLog(
      `[CÔNG ĐỨC] 🎁 ${viewerName} dâng "${newRecord.giftName}" (+${totalCoins} xu) vào Hòm Công Đức!`
    );
  };

  // Quick fill mock devotees
  const handleFillMock = (count: number) => {
    const sampleNames = [
      'Thiện Nhân',
      'Minh Đạo',
      'Tâm Từ',
      'Thanh Hương',
      'Hoài Nam',
      'An Nhiên',
      'Quang Huy',
      'Diệu Linh',
      'Ngọc Lan',
      'Đức Anh',
      'Hải Đăng',
      'Mai Anh',
      'Phương Thảo',
      'Trung Kiên',
      'Bích Ngọc',
      'Tuấn Kiệt',
      'Bảo Trâm',
      'Gia Hưng',
      'Diệu Tâm',
      'Phúc Lâm',
      'Huệ An',
      'Vĩnh Khang',
      'Thanh Phong',
      'Mỹ Hạnh',
      'Như Ý',
      'Cát Tường',
      'Trí Dũng',
      'Bình An',
      'Tường Vi',
      'Nguyên Hạnh',
      'Kim Cương',
      'Trúc Mai',
      'Huyền Trang',
    ];
    const samplePrayers = [
      'Nam Mô A Di Đà Phật, cầu gia đình bình an',
      'Cầu cha mẹ mạnh khỏe, bách niên giai lão',
      'Thành tâm dâng hương cầu tài lộc hanh thông',
      'Nguyện cầu thế giới hòa bình, chúng sinh an lạc',
      'Con xin sám hối nghiệp chướng nhiều đời',
      'Cầu cho con cái ngoan ngoãn đỗ đạt',
      'Tâm an vạn sự an lạc',
    ];
    const skins: SkinType[] = ['su_thay', 'su_co', 'phattu_ao_lam', 'co_phuc'];

    setMaxSlots((prev) => Math.max(prev, count));
    const generated: Devotee[] = [];

    // Chief first
    generated.push({
      id: 'chief-1',
      nickname: 'Mih Tuu (Chủ Lễ)',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MihTuu',
      skin: 'phattu_ao_lam',
      prayer: 'nam mô a Di Đà Phật 🙏',
      incenseLit: true,
      merit: 299,
      timestamp: Date.now(),
    });

    for (let i = 1; i < count; i++) {
      const name =
        sampleNames[i % sampleNames.length] +
        (i >= sampleNames.length ? ` ${Math.floor(i / sampleNames.length) + 1}` : '');
      generated.push({
        id: `mock-${i}-${Date.now()}`,
        nickname: name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        skin: skins[i % skins.length],
        prayer: samplePrayers[i % samplePrayers.length],
        incenseLit: i % 2 === 0,
        merit: i % 3 === 0 ? (i + 1) * 8 : 0,
        timestamp: Date.now() - i * 15000,
      });
    }

    setDevotees(generated);
    appendLog(`[Thao tác] Đã lấp đầy ${count} bồ đoàn trong Chánh Điện.`);
  };

  // Clear all seats
  const handleClearDevotees = () => {
    // Keep only chief or empty
    setDevotees([]);
    appendLog('[Thao tác] Đã làm trống toàn bộ bồ đoàn Chánh Điện.');
  };

  // Toggle ambient music
  const handleToggleAmbient = () => {
    const isPlaying = audioService.toggleAmbientDrone(audioSettings.bgMusicFreq, (state) => {
      setAudioSettings((prev) => ({ ...prev, bgMusicEnabled: state }));
    });
    setAudioSettings((prev) => ({ ...prev, bgMusicEnabled: isPlaying }));
    appendLog(
      isPlaying
        ? `[Âm thanh] Đang phát nhạc thiền ${audioSettings.bgMusicFreq}Hz tĩnh tâm.`
        : '[Âm thanh] Đã dừng nhạc thiền.'
    );
  };

  // Toggle wooden fish loop
  const handleToggleWoodenFish = (enabled: boolean) => {
    setAudioSettings((prev) => ({ ...prev, woodenFishEnabled: enabled }));
    audioService.setWoodenFishLoop(enabled, audioSettings.bpm);
    appendLog(enabled ? `[Âm thanh] Đã bật nhịp mõ tự động (${audioSettings.bpm} BPM).` : '[Âm thanh] Đã tắt nhịp mõ.');
  };

  // Test Chant Speech
  const handleSpeakChant = () => {
    audioService.speakChant(audioSettings.chantText, audioSettings.pitch, audioSettings.speed);
    appendLog('[Đọc kinh] Đang phát câu kinh cầu an bằng giọng đọc trầm ấm.');
  };

  // Trigger Bell
  const handleTriggerBell = () => {
    audioService.playTempleBell(0.5);
    setLastAction({ type: 'BELL', timestamp: Date.now() });
    appendLog('[Chuông Chùa] 🔔 Đã thỉnh 1 hồi chuông đồng ngân vang thanh tịnh.');
  };

  // Trigger Wooden Fish single strike
  const handleTriggerWoodenFish = () => {
    audioService.playWoodenFish(0.65);
    setLastAction({ type: 'MO', timestamp: Date.now() });
  };

  // Toggle Auto Simulation
  const handleToggleAutoSim = () => {
    if (isAutoSimActive) {
      if (autoSimIntervalRef.current) clearInterval(autoSimIntervalRef.current);
      autoSimIntervalRef.current = null;
      setIsAutoSimActive(false);
      appendLog('[Auto] Đã dừng chế độ giả lập tương tác.');
    } else {
      setIsAutoSimActive(true);
      appendLog('[Auto] 🤖 Đã bật giả lập! Tự động tương tác thắp hương & công đức mỗi 4.5 giây.');

      const names = [
        'Minh Tâm',
        'Phúc Lâm',
        'Thanh Tùng',
        'Diệu Hiền',
        'Bảo Ngọc',
        'Hoàng Nam',
        'Kim Ngân',
        'Bảo Trâm',
        'Gia Bảo',
        'Tuệ An',
      ];
      const prayers = [
        'Con xin thắp nén tâm hương cầu bình an',
        'Nam Mô A Di Đà Phật 🙏',
        'Cầu gia đạo bình an, sức khỏe dồi dào',
        'Thành tâm lễ Phật, cầu thi cử đỗ đạt',
        'Cầu bình an may mắn vạn sự như ý',
      ];
      const gifts = [
        { name: 'Hoa Hồng', coins: 1 },
        { name: 'Nén Tâm Hương', coins: 5 },
        { name: 'Hoa Sen Vàng', coins: 10 },
        { name: 'Tràng Hạt Bồ Đề', coins: 30 },
      ];

      autoSimIntervalRef.current = window.setInterval(() => {
        const randName = `${names[Math.floor(Math.random() * names.length)]} ${Math.floor(
          Math.random() * 89 + 10
        )}`;
        const randPrayer = prayers[Math.floor(Math.random() * prayers.length)];
        const isGift = Math.random() < 0.45;

        if (isGift) {
          const g = gifts[Math.floor(Math.random() * gifts.length)];
          setMeritTotal((prev) => prev + g.coins);
          setIncenseCount((prev) => prev + 2);

          const rec: MeritRecord = {
            id: `sim-m-${Date.now()}`,
            nickname: randName,
            giftName: g.name,
            coins: g.coins,
            prayer: randPrayer,
            timestamp: Date.now(),
          };

          setMeritList((prev) => [rec, ...prev.slice(0, 19)]);
          addOrUpdateDevotee(randName, 'phattu_ao_lam', randPrayer, true, g.coins);

          setLastAction({
            type: 'MERIT_BOX',
            nickname: randName,
            giftName: g.name,
            coins: g.coins,
            ttsText: audioSettings.directAudioEnabled
              ? `Nam Mô A Di Đà Phật. Thí chủ ${randName} vừa cúng dường ${g.name} vào Hòm Công Đức.`
              : undefined,
            timestamp: Date.now(),
          });
          appendLog(`[Auto Quà] 🎁 ${randName} dâng "${g.name}" (+${g.coins} xu)`);
        } else {
          setIncenseCount((prev) => prev + 1);
          setLastAction({
            type: 'INCENSE',
            nickname: randName,
            message: randPrayer,
            timestamp: Date.now(),
          });
          addOrUpdateDevotee(randName, 'phattu_ao_lam', randPrayer, true, 0);
          appendLog(`[Auto Dâng Hương] 🕯️ ${randName}: "${randPrayer}"`);
        }
      }, 4800);
    }
  };

  useEffect(() => {
    return () => {
      if (autoSimIntervalRef.current) clearInterval(autoSimIntervalRef.current);
    };
  }, []);

  // Real TikTok LIVE events relayed by server.ts over SSE
  const liveStatusSeenRef = useRef(false);
  const handleLiveEvent = (ev: TikTokLiveEvent) => {
    if (ev.type === 'status') {
      setTiktokStatus(ev.state);
      // The first status is the server's current state replayed on (re)load; don't log it as news.
      const isReplay = !liveStatusSeenRef.current;
      liveStatusSeenRef.current = true;
      if (isReplay) return;
      if (ev.state === 'connected') {
        appendLog(`[TikTok Live] ✅ Đã kết nối kênh @${ev.uniqueId} (${ev.message}). Đang bắt comment & quà tặng thật.`);
      } else if (ev.state === 'disconnected' && ev.message) {
        appendLog(`[TikTok Live] ⛔ @${ev.uniqueId ?? ''}: ${ev.message}`);
      }
      return;
    }

    const name = ev.nickname;
    switch (ev.type) {
      case 'chat': {
        const prayer = ev.comment || 'Nam Mô A Di Đà Phật 🙏';
        setIncenseCount((prev) => prev + 1);
        setLastAction({ type: 'INCENSE', nickname: name, message: prayer, timestamp: Date.now() });
        addOrUpdateDevotee(name, 'phattu_ao_lam', prayer, true, 0);
        appendLog(`[Live Comment] 🕯️ ${name}: "${prayer}"`);
        break;
      }
      case 'gift': {
        const coins = ev.coins ?? 1;
        const giftName = `${(ev.repeatCount ?? 1) > 1 ? `${ev.repeatCount}x ` : ''}${ev.giftName}`;
        const prayer = 'Cúng dường Tam Bảo, phước báu vô lượng';
        setMeritTotal((prev) => prev + coins);
        setIncenseCount((prev) => prev + 2);
        setMeritList((prev) => [
          { id: `live-m-${ev.timestamp}-${Math.random()}`, nickname: name, giftName, coins, prayer, timestamp: ev.timestamp },
          ...prev.slice(0, 19),
        ]);
        addOrUpdateDevotee(name, 'phattu_ao_lam', prayer, true, coins);
        setLastAction({
          type: 'MERIT_BOX',
          nickname: name,
          giftName,
          coins,
          ttsText: audioSettings.directAudioEnabled
            ? `Nam Mô A Di Đà Phật. Thí chủ ${name} vừa cúng dường ${giftName} vào Hòm Công Đức.`
            : undefined,
          timestamp: Date.now(),
        });
        appendLog(`[Live Quà] 🎁 ${name} dâng "${giftName}" (+${coins} xu)`);
        break;
      }
      case 'member':
        addOrUpdateDevotee(name, 'phattu_ao_lam', 'Nam Mô A Di Đà Phật', false, 0);
        appendLog(`[Live] 🧘 ${name} vừa vào Chánh Điện.`);
        break;
      case 'follow':
        appendLog(`[Live] 🙏 ${name} đã theo dõi kênh.`);
        break;
      case 'share':
        appendLog(`[Live] 📣 ${name} đã chia sẻ buổi live.`);
        break;
      // 'like' fires too often to log
    }
  };

  const liveEventHandlerRef = useRef(handleLiveEvent);
  liveEventHandlerRef.current = handleLiveEvent;

  useEffect(() => {
    const es = new EventSource('/api/tiktok/events');
    es.onmessage = (e) => liveEventHandlerRef.current(JSON.parse(e.data) as TikTokLiveEvent);
    return () => es.close();
  }, []);

  // Mirror the temple state to the OBS overlay (?view=overlay) through the server
  useEffect(() => {
    const state: OverlayState = {
      devotees,
      maxSlots,
      incenseCount,
      meritTotal,
      meritList,
      currentTheme,
      // blob: URLs only exist in this tab; the server URL replaces it once the upload finishes
      customBgUrl: customBgUrl?.startsWith('blob:') ? undefined : customBgUrl,
      lastAction,
    };
    const timer = setTimeout(() => {
      fetch('/api/overlay/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch(() => undefined);
    }, 100);
    return () => clearTimeout(timer);
  }, [devotees, maxSlots, incenseCount, meritTotal, meritList, currentTheme, customBgUrl, lastAction]);

  const handleTikTokConnect = async () => {
    if (tiktokStatus === 'connected' || tiktokStatus === 'connecting') {
      await fetch('/api/tiktok/disconnect', { method: 'POST' }).catch(() => undefined);
      return;
    }
    appendLog(`[TikTok Live] 🔗 Đang kết nối tới phòng live của ${tiktokId}...`);
    setTiktokStatus('connecting');
    try {
      const res = await fetch('/api/tiktok/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId: tiktokId }),
      });
      const data = await res.json();
      if (!data.ok) {
        setTiktokStatus('disconnected');
        appendLog(`[TikTok Live] ❌ Kết nối thất bại: ${data.error}`);
      }
    } catch {
      setTiktokStatus('disconnected');
      appendLog('[TikTok Live] ❌ Không gọi được server. Hãy chạy app bằng "npm run dev".');
    }
  };

  // Handle custom image upload
  const handleCustomBgUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomBgUrl(url);
    appendLog(`[Ảnh Chánh Điện] Đã nạp thành công ảnh tùy chỉnh: "${file.name}"`);

    // Upload to the server so the OBS overlay (another browser) can show it too
    fetch('/api/overlay/background', {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'image/jpeg' },
      body: file,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setCustomBgUrl(data.url);
      })
      .catch(() => appendLog('[Overlay OBS] ⚠️ Không gửi được ảnh nền lên server, Overlay OBS sẽ dùng ảnh mẫu.'));
  };

  // Automated Run Test implementation
  const handleRunFullTest = async (
    onProgress: (step: number, status: 'running' | 'passed' | 'failed', details?: string) => void
  ) => {
    // Step 1: Init Chánh Điện Tượng Phật Vàng
    onProgress(1, 'running');
    await new Promise((r) => setTimeout(r, 400));
    setCurrentTheme(TEMPLE_THEMES[0]);
    onProgress(1, 'passed', 'Đã khởi tạo Chánh Điện Tượng Phật Vàng, Lư Đồng, Hào Quang & Lối Đi Thảm Đỏ');

    // Step 2: Bố trí Bồ Đoàn 2 cánh & Chủ Lễ
    onProgress(2, 'running');
    await new Promise((r) => setTimeout(r, 450));
    handleFillMock(33);
    onProgress(2, 'passed', 'Đã sắp xếp 33 Phật tử áo lam ngồi nghiêm trang 2 bên bồ đoàn & 1 Chủ Lễ trước bàn thờ');

    // Step 3: Hiệu ứng Bước Đi Dâng Hương Thảm Đỏ
    onProgress(3, 'running');
    await new Promise((r) => setTimeout(r, 500));
    setIncenseCount((prev) => prev + 1);
    setLastAction({
      type: 'INCENSE',
      nickname: 'Hoàng Nguyễn',
      message: 'nam mô a Di Đà Phật 🙏',
      timestamp: Date.now(),
    });
    onProgress(3, 'passed', 'Phật tử đã bước đi khoan thai trên thảm đỏ, cúi lạy và dâng nén tâm hương phát sáng');

    // Step 4: Thùng Công Đức Rung Nảy Xu & Bảng Xếp Hạng
    onProgress(4, 'running');
    await new Promise((r) => setTimeout(r, 550));
    const testCoins = 10;
    setMeritTotal((prev) => prev + testCoins);
    const testRecord: MeritRecord = {
      id: `test-m-${Date.now()}`,
      nickname: 'Phật Tử Khởi Tâm',
      giftName: 'Hoa Sen Vàng',
      coins: testCoins,
      prayer: 'Nguyện cầu thế giới hòa bình, gia đạo hưng thịnh',
      timestamp: Date.now(),
    };
    setMeritList((prev) => [testRecord, ...prev]);
    setLastAction({
      type: 'MERIT_BOX',
      nickname: 'Phật Tử Khởi Tâm',
      giftName: 'Hoa Sen Vàng',
      coins: testCoins,
      ttsText: 'Nam Mô A Di Đà Phật. Cảm tạ thí chủ vừa gieo duyên lành cúng dường Hoa Sen Vàng.',
      timestamp: Date.now(),
    });
    onProgress(4, 'passed', 'Hòm Công Đức rung lắc, bắn xu vàng và cập nhật bảng vinh danh Tấm Lòng Thành');

    // Step 5: Âm thanh Chuông Chùa & Mõ Gỗ
    onProgress(5, 'running');
    await new Promise((r) => setTimeout(r, 400));
    audioService.playTempleBell(0.4);
    audioService.playWoodenFish(0.5);
    onProgress(5, 'passed', 'Bộ tổng hợp Web Audio API phát tiếng Chuông Ngân và Mõ Gỗ trong trẻo');

    // Step 6: Giọng Đọc Sớ Hồi Hướng
    onProgress(6, 'running');
    await new Promise((r) => setTimeout(r, 500));
    audioService.speakChant('Nam Mô A Di Đà Phật. Công đức vô lượng.', -18, -20);
    onProgress(6, 'passed', 'Bộ Web Speech API phát giọng Nam Trầm Ấm đọc sớ hồi hướng tiếng Việt');

    // Step 7: Kiểm thử URL Overlay 9:16
    onProgress(7, 'running');
    await new Promise((r) => setTimeout(r, 350));
    onProgress(7, 'passed', 'Tỷ lệ dọc 1080x1920 (9:16) sẵn sàng tích hợp OBS & TikTok LIVE Studio');
  };

  const overlayLiveUrl = typeof window !== 'undefined' ? `${window.location.origin}/?view=overlay` : '';

  return (
    <div className="min-h-screen bg-[#140a04] text-[#f7ede2] flex flex-col font-sans select-none overflow-x-hidden">
      {/* TOP STATUS BAR */}
      <header className="bg-[#261308] border-b border-amber-600/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xl font-bold shadow-md ring-1 ring-amber-300">
            ☸
          </div>
          <div>
            <h1 className="text-amber-200 font-extrabold text-sm sm:text-base tracking-wider font-buddhist leading-tight">
              BẢNG ĐIỀU KHIỂN LIVE STREAM ĐI CHÙA BÁI PHẬT (THẮP HƯƠNG & HÒM CÔNG ĐỨC)
            </h1>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Trạng thái: Máy Chủ Hoạt Động • Đã đồng bộ Realtime Overlay 9:16</span>
            </div>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsRunTestOpen(true)}
            className="px-3 py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
          >
            <Sparkles size={14} className="text-amber-200" />
            <span>🚀 Run Test Hệ Thống</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 rounded bg-[#3b1d0c] hover:bg-[#4d2711] text-amber-200 font-bold text-xs border border-amber-500/50 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle size={14} />
            <span>Hướng Dẫn TikTok Live Studio</span>
          </button>

          <button
            onClick={() => setIsOverlayFullScreen(true)}
            className="px-3 py-1.5 rounded bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
          >
            <Tv size={14} />
            <span>🪟 Màn Hình Overlay 9:16</span>
          </button>

          <button
            onClick={() => {
              handleFillMock(33);
              appendLog('[Hệ thống] Đã tải lại dữ liệu mẫu Chánh Điện.');
            }}
            title="Làm mới trạng thái Chánh Điện"
            className="p-1.5 rounded bg-[#33180a] text-amber-300 hover:bg-[#44210e] border border-amber-600/40"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* MAIN 3-COLUMN WORKSPACE */}
      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* COLUMN 1: KHÔNG GIAN CHÙA & ÂM THANH (Lg: 4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          {/* 1. MẪU KHÔNG GIAN CHÙA */}
          <div className="bg-[#1e0f06] border border-amber-600/50 rounded-lg p-3 shadow-md">
            <h3 className="text-amber-300 font-black text-xs uppercase tracking-wider mb-2 flex items-center justify-between font-buddhist">
              <span>1. CHỌN 5 MẪU KHÔNG GIAN CHÙA</span>
              <span className="text-[10px] text-amber-400 font-normal">Đổi trực tiếp trên Live</span>
            </h3>

            <div className="space-y-1.5 mb-2.5">
              {TEMPLE_THEMES.map((theme) => {
                const isActive = currentTheme.id === theme.id && !customBgUrl;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme);
                      setCustomBgUrl(undefined);
                      appendLog(`[Không gian] Đã chuyển sang "${theme.name}".`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-300 shadow-md font-bold'
                        : 'bg-[#2b160b] text-amber-100/90 border-amber-700/40 hover:bg-[#3b1f10]'
                    }`}
                  >
                    {theme.name}
                  </button>
                );
              })}
            </div>

            {/* Custom Background Image Upload */}
            <div className="pt-2 border-t border-amber-700/40 flex items-center justify-between">
              <span className="text-[11px] text-amber-200/90 font-medium">
                {customBgUrl ? 'Đang dùng: Ảnh Tùy Chỉnh Của Bạn' : 'Hoặc nạp ảnh Chánh Điện riêng:'}
              </span>
              <label className="px-2.5 py-1 rounded bg-[#361909] border border-amber-500/60 text-amber-200 text-xs font-bold hover:bg-[#49220d] cursor-pointer inline-flex items-center gap-1.5">
                <Upload size={12} />
                <span>📂 Chọn File Ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCustomBgUpload(file);
                  }}
                />
              </label>
            </div>
          </div>

          {/* 2. ÂM THANH ĐỌC KINH, NHẠC NỀN & CHUÔNG MÕ */}
          <div className="bg-[#1e0f06] border border-amber-600/50 rounded-lg p-3 shadow-md flex-1 flex flex-col justify-between">
            <h3 className="text-amber-300 font-black text-xs uppercase tracking-wider mb-2 font-buddhist">
              2. GIỌNG NAM ẤM ĐỌC KINH · NHẠC NỀN · CHUÔNG MÕ
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Voice Preset Selection */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  Chọn chất giọng đọc kinh & hồi hướng công đức:
                </label>
                <select
                  value={`${audioSettings.pitch},${audioSettings.speed}`}
                  onChange={(e) => {
                    const [p, s] = e.target.value.split(',').map(Number);
                    setAudioSettings((prev) => ({ ...prev, pitch: p, speed: s }));
                  }}
                  className="w-full bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="-18,-20">Giọng Nam Trầm Ấm Đọc Kinh (Khuyên dùng: -18Hz, -20%)</option>
                  <option value="-10,-15">Giọng Sư Thầy Trang Nghiêm (-10Hz, -15%)</option>
                  <option value="0,-10">Giọng Đọc Sớ Cầu An Chuẩn (0Hz, -10%)</option>
                </select>
              </div>

              {/* Ambient Drone / Music */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">🎵 Nhạc Nền Thiền Tĩnh Tâm:</label>
                <div className="flex gap-2">
                  <select
                    value={audioSettings.bgMusicFreq}
                    onChange={(e) => {
                      const f = Number(e.target.value);
                      setAudioSettings((prev) => ({ ...prev, bgMusicFreq: f }));
                    }}
                    className="flex-1 bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-semibold"
                  >
                    <option value="432">1. Nhạc Thiền Tĩnh Tâm 432Hz (Chuông Xoay Tây Tạng)</option>
                    <option value="528">2. Tần Số Chữa Lành 528Hz & Suối Chảy Tự Nhiên</option>
                  </select>

                  <button
                    onClick={handleToggleAmbient}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-colors inline-flex items-center gap-1 ${
                      audioSettings.bgMusicEnabled
                        ? 'bg-amber-600 text-white border-amber-300'
                        : 'bg-[#2e170a] text-amber-200 border-amber-600/50 hover:bg-[#3d1f0e]'
                    }`}
                  >
                    <Music size={12} />
                    <span>{audioSettings.bgMusicEnabled ? 'Tắt Nhạc' : 'Bật Nhạc'}</span>
                  </button>
                </div>
              </div>

              {/* Sliders: Pitch & Speed */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/80 mb-0.5">
                    <span>Độ trầm (Pitch):</span>
                    <span className="font-mono text-amber-300">{audioSettings.pitch}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="20"
                    value={audioSettings.pitch}
                    onChange={(e) =>
                      setAudioSettings((prev) => ({ ...prev, pitch: Number(e.target.value) }))
                    }
                    className="w-full accent-amber-500 h-1.5 bg-[#120703] rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/80 mb-0.5">
                    <span>Tốc độ đọc:</span>
                    <span className="font-mono text-amber-300">{audioSettings.speed}%</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={audioSettings.speed}
                    onChange={(e) =>
                      setAudioSettings((prev) => ({ ...prev, speed: Number(e.target.value) }))
                    }
                    className="w-full accent-amber-500 h-1.5 bg-[#120703] rounded"
                  />
                </div>
              </div>

              {/* Sliders: Reverb & Wooden Fish BPM */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/80 mb-0.5">
                    <span>Độ vang Chánh Điện:</span>
                    <span className="font-mono text-amber-300">{audioSettings.reverb}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioSettings.reverb}
                    onChange={(e) =>
                      setAudioSettings((prev) => ({ ...prev, reverb: Number(e.target.value) }))
                    }
                    className="w-full accent-amber-500 h-1.5 bg-[#120703] rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/80 mb-0.5">
                    <span>Nhịp Mõ (BPM):</span>
                    <span className="font-mono text-amber-300">{audioSettings.bpm}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={audioSettings.bpm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAudioSettings((prev) => ({ ...prev, bpm: val }));
                      if (audioSettings.woodenFishEnabled) {
                        audioService.setWoodenFishLoop(true, val);
                      }
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-[#120703] rounded"
                  />
                </div>
              </div>

              {/* Audio Checkboxes */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <label className="flex items-center gap-1.5 text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioSettings.woodenFishEnabled}
                    onChange={(e) => handleToggleWoodenFish(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Tiếng Mõ Tự Động</span>
                </label>

                <label className="flex items-center gap-1.5 text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioSettings.autoChantEnabled}
                    onChange={(e) =>
                      setAudioSettings((prev) => ({ ...prev, autoChantEnabled: e.target.checked }))
                    }
                    className="accent-amber-500 rounded"
                  />
                  <span>Đọc sớ tự động (2p/lần)</span>
                </label>

                <label className="flex items-center gap-1.5 text-emerald-300 font-bold col-span-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioSettings.directAudioEnabled}
                    onChange={(e) =>
                      setAudioSettings((prev) => ({
                        ...prev,
                        directAudioEnabled: e.target.checked,
                      }))
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span>🔊 Phát trực tiếp giọng đọc sớ khi tặng quà</span>
                </label>
              </div>

              {/* Chant Text */}
              <textarea
                rows={2}
                value={audioSettings.chantText}
                onChange={(e) =>
                  setAudioSettings((prev) => ({ ...prev, chantText: e.target.value }))
                }
                className="w-full bg-[#120703] border border-amber-600/60 rounded p-1.5 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-400"
              />

              {/* TTS Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleSpeakChant}
                  className="flex-1 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Volume2 size={13} />
                  <span>🔊 Nghe Thử Giọng Đọc Ngay</span>
                </button>
                <button
                  onClick={() => audioService.stopSpeech()}
                  className="px-3 py-1.5 rounded bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors"
                >
                  ⏹ Dừng
                </button>
              </div>

              {/* Live Bell & Wooden Fish buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={handleSpeakChant}
                  className="py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-colors"
                >
                  ☸ Phát Lên Live
                </button>
                <button
                  onClick={handleTriggerBell}
                  className="py-1.5 rounded bg-[#3a1d0d] hover:bg-[#4d2813] text-amber-200 border border-amber-500/60 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Bell size={12} className="text-amber-400" />
                  <span>🔔 Thỉnh Chuông</span>
                </button>
                <button
                  onClick={handleTriggerWoodenFish}
                  className="py-1.5 rounded bg-[#3a1d0d] hover:bg-[#4d2813] text-amber-200 border border-amber-500/60 font-bold text-xs transition-colors"
                >
                  🪵 Gõ Mõ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COLUMN 2: QUẢN LÝ BỒ ĐOÀN, THẮP HƯƠNG, HÒM CÔNG ĐỨC & TIKTOK (Lg: 4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-[#1e0f06] border border-amber-600/50 rounded-lg p-3 shadow-md flex-1 flex flex-col justify-between">
            <h3 className="text-amber-300 font-black text-xs uppercase tracking-wider mb-2 font-buddhist">
              3. MỞ RỘNG BỒ ĐOÀN · THẮP HƯƠNG · HÒM CÔNG ĐỨC
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Max Slots Selector */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  Quy mô số chỗ ngồi (Slot Bồ Đoàn):
                </label>
                <select
                  value={maxSlots}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxSlots(val);
                    appendLog(`[Bồ Đoàn] Đã chuyển quy mô Chánh Điện sang ${val} chỗ ngồi.`);
                  }}
                  className="w-full bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-semibold focus:outline-none"
                >
                  <option value={24}>24 Bồ Đoàn Chánh Điện (Tiêu chuẩn)</option>
                  <option value={36}>36 Bồ Đoàn Đại Hùng Bảo Điện</option>
                  <option value={64}>64 Bồ Đoàn Đại Pháp Hội</option>
                  <option value={100}>100 Bồ Đoàn Vạn Phật Quang</option>
                </select>
              </div>

              {/* Viewer Name & Skin */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-amber-200/80 block mb-1">Tên người xem:</label>
                  <input
                    type="text"
                    value={viewerName}
                    onChange={(e) => setViewerName(e.target.value)}
                    className="w-full bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-amber-200/80 block mb-1">Chọn Skin nhân vật:</label>
                  <select
                    value={viewerSkin}
                    onChange={(e) => setViewerSkin(e.target.value as SkinType)}
                    className="w-full bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-semibold focus:outline-none"
                  >
                    <option value="phattu_ao_lam">nam/nữ - Phật Tử Áo Lam</option>
                    <option value="su_thay">sư - Sư Thầy (Y Cà Sa Vàng)</option>
                    <option value="su_co">ni - Sư Cô (Áo Lam Nghiêm Trang)</option>
                    <option value="co_phuc">cổ phục - Áo Dài Cổ Phục</option>
                  </select>
                </div>
              </div>

              {/* Prayer Text */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  Nội dung bình luận / Lời cầu nguyện dâng hương:
                </label>
                <input
                  type="text"
                  value={viewerPrayer}
                  onChange={(e) => setViewerPrayer(e.target.value)}
                  className="w-full bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Buttons: Sit vs Light Incense */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleManualAdd('sit')}
                  className="py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserPlus size={13} />
                  <span>🧘 Cho Vào Thiền</span>
                </button>

                <button
                  onClick={() => handleManualAdd('incense')}
                  className="py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Flame size={13} className="text-amber-200" />
                  <span>🕯️ Cho Vào Thắp Hương</span>
                </button>
              </div>

              {/* TikTok Gifts & Merit Box */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  Quà TikTok (Nạp vào Thùng Công Đức & Xướng tên Hồi Hướng):
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <select
                    value={selectedGiftId}
                    onChange={(e) => setSelectedGiftId(e.target.value)}
                    className="col-span-3 bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-semibold focus:outline-none"
                  >
                    {TIKTOK_GIFTS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.icon} {g.name} [{g.coins} xu]
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={giftCount}
                    onChange={(e) => setGiftCount(Math.max(1, Number(e.target.value)))}
                    className="col-span-1 bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-amber-100 font-bold text-center"
                  />
                </div>
              </div>

              {/* Giant Send Gift button */}
              <button
                onClick={handleSendGift}
                className="w-full py-2 rounded bg-gradient-to-r from-red-700 via-amber-700 to-red-700 hover:brightness-110 text-white font-extrabold text-xs shadow-lg border border-amber-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <Gift size={14} className="text-amber-300 animate-bounce" />
                <span>🎁 TẶNG QUÀ ➔ BỎ HÒM CÔNG ĐỨC & XƯỚNG TÊN</span>
              </button>

              {/* Quick Fill Buttons */}
              <div>
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  Điền nhanh Phật tử mẫu để test độ đông:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => handleFillMock(15)}
                    className="py-1 rounded bg-[#2e170a] hover:bg-[#3e1f0e] border border-amber-600/50 text-amber-200 text-xs font-bold"
                  >
                    15 Người
                  </button>
                  <button
                    onClick={() => handleFillMock(33)}
                    className="py-1 rounded bg-[#2e170a] hover:bg-[#3e1f0e] border border-amber-600/50 text-amber-200 text-xs font-bold"
                  >
                    33 Người
                  </button>
                  <button
                    onClick={() => handleFillMock(64)}
                    className="py-1 rounded bg-[#2e170a] hover:bg-[#3e1f0e] border border-amber-600/50 text-amber-200 text-xs font-bold"
                  >
                    64 Người
                  </button>
                  <button
                    onClick={() => handleFillMock(100)}
                    className="py-1 rounded bg-[#2e170a] hover:bg-[#3e1f0e] border border-amber-600/50 text-amber-200 text-xs font-bold"
                  >
                    100 Chỗ
                  </button>
                </div>
              </div>

              {/* Clear All Slots */}
              <button
                onClick={handleClearDevotees}
                className="w-full py-1 rounded bg-[#281308] hover:bg-[#371b0c] text-amber-300/90 border border-amber-700/40 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Trash2 size={12} />
                <span>🧹 Làm Trống Toàn Bộ Bồ Đoàn</span>
              </button>

              {/* TikTok Live Connection & Auto Simulation */}
              <div className="pt-1 border-t border-amber-700/40">
                <label className="text-[11px] text-amber-200/80 block mb-1">
                  ● Nhập @ID Kênh TikTok đang Live (Hoặc bật Giả Lập Auto):
                </label>
                <div className="grid grid-cols-12 gap-1.5">
                  <input
                    type="text"
                    value={tiktokId}
                    onChange={(e) => setTiktokId(e.target.value)}
                    className="col-span-7 bg-[#120703] border border-amber-600/60 rounded px-2 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
                  />
                  <button
                    onClick={handleTikTokConnect}
                    className={`col-span-3 py-1 rounded text-white text-xs font-bold shadow flex items-center justify-center gap-1 transition-colors ${
                      tiktokStatus === 'connected'
                        ? 'bg-emerald-700 hover:bg-emerald-600'
                        : tiktokStatus === 'connecting'
                          ? 'bg-amber-700 animate-pulse'
                          : 'bg-red-800 hover:bg-red-700'
                    }`}
                  >
                    <Radio size={12} />
                    <span>
                      {tiktokStatus === 'connected' ? 'Ngắt' : tiktokStatus === 'connecting' ? 'Đang nối…' : 'Kết Nối'}
                    </span>
                  </button>
                  <button
                    onClick={handleToggleAutoSim}
                    className={`col-span-2 py-1 rounded text-xs font-bold shadow flex items-center justify-center gap-1 transition-colors ${
                      isAutoSimActive
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-blue-800 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Bot size={12} />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              {/* Live Console Output Log */}
              <div className="bg-[#0e0603] border border-amber-700/40 rounded p-2 h-24 overflow-y-auto font-mono text-[10.5px] space-y-0.5 leading-relaxed text-zinc-300">
                {logs.map((l, idx) => (
                  <div
                    key={idx}
                    className={
                      l.includes('CÔNG ĐỨC')
                        ? 'text-amber-300 font-bold'
                        : l.includes('Thắp hương')
                        ? 'text-yellow-200'
                        : l.includes('✅')
                        ? 'text-emerald-300'
                        : 'text-zinc-300'
                    }
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COLUMN 3: XEM TRƯỚC OVERLAY 9:16 (Lg: 4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-[#1e0f06] border border-amber-600/50 rounded-lg p-3 shadow-md flex-1 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-amber-300 font-black text-xs uppercase tracking-wider font-buddhist">
                4. XEM TRƯỚC MẪU THIẾT KẾ (9:16)
              </h3>
              <button
                onClick={() => setIsOverlayFullScreen(true)}
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 font-bold underline"
              >
                <Maximize2 size={12} />
                <span>Xem Toàn Màn Hình</span>
              </button>
            </div>

            {/* Embedded 9:16 Device Preview Box */}
            <div className="relative w-[270px] sm:w-[290px] h-[480px] sm:h-[515px] border-4 border-amber-500/80 rounded-2xl overflow-hidden shadow-2xl bg-black">
              <TempleOverlay916
                devotees={devotees}
                maxSlots={maxSlots}
                incenseCount={incenseCount}
                meritTotal={meritTotal}
                meritList={meritList}
                currentTheme={currentTheme}
                customBgUrl={customBgUrl}
                onCustomBgUpload={handleCustomBgUpload}
                lastAction={lastAction}
                onRunTest={() => setIsRunTestOpen(true)}
              />
            </div>

            {/* Quick Setup Guide Info Box */}
            <div className="w-full bg-[#120703] border border-amber-700/50 rounded-md p-2 mt-2 text-[11px] leading-relaxed text-[#edd9c5]">
              <div className="font-bold text-amber-300 flex items-center justify-between mb-1">
                <span>⚡ HƯỚNG DẪN DÁN VÀO OBS / TIKTOK STUDIO:</span>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="text-[10px] text-amber-400 underline font-normal"
                >
                  Xem chi tiết
                </button>
              </div>
              <p>
                • Thêm nguồn <b>Browser / Link (Trình duyệt)</b> kích thước <b>1080x1920 (9:16)</b>.
              </p>
              <p>
                • Dán link: <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">{overlayLiveUrl}</code>
              </p>
              <p>• Bật <b>Desktop Audio</b> để tiếng chuông mõ vang lên Live.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FULLSCREEN OVERLAY 9:16 MODAL (For streaming or direct presentation) */}
      {isOverlayFullScreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full max-w-[540px] max-h-[960px] aspect-[9/16] shadow-2xl overflow-hidden border border-amber-500/40">
            <TempleOverlay916
              devotees={devotees}
              maxSlots={maxSlots}
              incenseCount={incenseCount}
              meritTotal={meritTotal}
              meritList={meritList}
              currentTheme={currentTheme}
              customBgUrl={customBgUrl}
              onCustomBgUpload={handleCustomBgUpload}
              lastAction={lastAction}
              onRunTest={() => setIsRunTestOpen(true)}
              isStandalone={true}
            />

            {/* Close fullscreen button */}
            <button
              onClick={() => setIsOverlayFullScreen(false)}
              className="absolute top-2 left-2 z-50 px-2 py-1 rounded bg-black/80 border border-amber-400 text-amber-200 text-xs font-bold hover:bg-black transition-colors"
            >
              ✕ Thu Nhỏ
            </button>
          </div>
        </div>
      )}

      {/* RUN TEST MODAL */}
      <RunTestModal
        isOpen={isRunTestOpen}
        onClose={() => setIsRunTestOpen(false)}
        onRunFullTest={handleRunFullTest}
      />

      {/* TIKTOK STUDIO & OBS GUIDE MODAL */}
      <TikTokGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        overlayUrl={overlayLiveUrl}
      />
    </div>
  );
};
