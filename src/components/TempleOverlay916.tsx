import React, { useState, useEffect } from 'react';
import { Devotee, MeritRecord, TempleTheme, ActionEffect } from '../types';
import { DevoteeFigure } from './DevoteeFigure';
import { Volume2, VolumeX, Eye, EyeOff, Upload, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';

interface TempleOverlay916Props {
  devotees: Devotee[];
  maxSlots: number;
  incenseCount: number;
  meritTotal: number;
  meritList: MeritRecord[];
  currentTheme: TempleTheme;
  customBgUrl?: string;
  onCustomBgUpload?: (file: File) => void;
  lastAction?: ActionEffect | null;
  onRunTest?: () => void;
  isStandalone?: boolean;
}

export const TempleOverlay916: React.FC<TempleOverlay916Props> = ({
  devotees,
  maxSlots,
  incenseCount,
  meritTotal,
  meritList,
  currentTheme,
  customBgUrl,
  onCustomBgUpload,
  lastAction,
  onRunTest,
  isStandalone = false,
}) => {
  const [activeWalkingPilgrim, setActiveWalkingPilgrim] = useState<{
    nickname: string;
    prayer: string;
    skin: Devotee['skin'];
  } | null>(null);

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [boxShake, setBoxShake] = useState(false);
  const [coinParticles, setCoinParticles] = useState<{ id: number; left: number }[]>([]);
  const [showToolbar, setShowToolbar] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background priority: uploaded custom image -> theme image
  const effectiveBg = customBgUrl || currentTheme.bgUrl;

  // React to actions (Incense, Gift / Merit Box)
  useEffect(() => {
    if (!lastAction) return;

    if (lastAction.type === 'INCENSE') {
      setActiveWalkingPilgrim({
        nickname: lastAction.nickname || 'Phật Tử Thành Tâm',
        prayer: lastAction.message || 'nam mô a Di Đà Phật 🙏',
        skin: 'phattu_ao_lam',
      });
      setToast({
        title: '🕯️ THÀNH TÂM DÂNG HƯƠNG 🕯️',
        message: `${lastAction.nickname || 'Phật tử'} vừa dâng nén tâm hương kính Phật!`,
      });
      if (soundEnabled) {
        audioService.playTempleBell(0.4);
      }
      setTimeout(() => setActiveWalkingPilgrim(null), 4800);
      setTimeout(() => setToast(null), 4200);
    } else if (lastAction.type === 'MERIT_BOX') {
      setActiveWalkingPilgrim({
        nickname: lastAction.nickname || 'Thí Chủ Hảo Tâm',
        prayer: `Dâng ${lastAction.giftName || 'quà'} cúng dường Tam Bảo`,
        skin: 'su_thay',
      });
      setBoxShake(true);
      // Spawn golden coins
      const newParticles = [
        { id: Date.now() + 1, left: 20 },
        { id: Date.now() + 2, left: 45 },
        { id: Date.now() + 3, left: 70 },
      ];
      setCoinParticles(newParticles);

      if (soundEnabled) {
        audioService.playCoinSound(0.6);
        audioService.playTempleBell(0.35);
        if (lastAction.ttsText) {
          audioService.speakChant(lastAction.ttsText);
        }
      }

      setToast({
        title: '✨ CÔNG ĐỨC VÔ LƯỢNG ✨',
        message: `Thí chủ ${lastAction.nickname} vừa cúng dường ${lastAction.giftName} (+${lastAction.coins} xu) vào Hòm Công Đức!`,
      });

      setTimeout(() => setBoxShake(false), 700);
      setTimeout(() => setCoinParticles([]), 900);
      setTimeout(() => setActiveWalkingPilgrim(null), 4800);
      setTimeout(() => setToast(null), 4600);
    }
  }, [lastAction, soundEnabled]);

  // Handle custom image file upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomBgUpload) {
      onCustomBgUpload(file);
    }
  };

  // Chief worshipper in front of altar (first or highest devotee)
  const chiefDevotee = devotees.length > 0 ? devotees[0] : null;
  // Seated devotees (split across wings)
  const seatedDevotees = devotees.length > 1 ? devotees.slice(1) : [];

  // Display incense sticks (max 15 sticks visually)
  const stickCount = Math.min(15, Math.max(3, incenseCount));

  // Determine grid density class based on slot count
  const getColSpan = () => {
    if (maxSlots >= 64) return 'grid-cols-4 gap-1.5';
    if (maxSlots >= 36) return 'grid-cols-3 gap-2';
    return 'grid-cols-2 gap-2.5';
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0d0502] text-amber-50 select-none flex flex-col font-sans">
      {/* 1. PHOTOREALISTIC TEMPLE SANCTUARY BACKGROUND */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 filter brightness-[0.96] contrast-[1.05]"
        style={{ backgroundImage: `url('${effectiveBg}')` }}
      />

      {/* Dark vignette & ambient temple gradient */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_25%] from-transparent via-[#140803a6] to-[#0a0402f0] pointer-events-none" />

      {/* God-Rays Light Stream */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-amber-200/15 to-transparent animate-beam-glow" />

      {/* Falling Lotus Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2 bg-gradient-to-br from-pink-300 to-rose-500 rounded-full opacity-70 animate-petal"
            style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${7 + (i % 3) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* OPTIONAL DEV / STREAMER TOOLBAR */}
      <div
        className={`absolute top-2 right-2 z-50 flex items-center gap-1.5 transition-opacity ${
          showToolbar ? 'opacity-85 hover:opacity-100' : 'opacity-0 hover:opacity-90'
        }`}
      >
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Tắt âm thanh Overlay' : 'Bật âm thanh Overlay'}
          className="p-1.5 rounded bg-black/75 border border-amber-500/50 text-amber-300 text-xs hover:bg-black"
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        <label
          title="Tải ảnh Chánh Điện riêng của bạn"
          className="p-1.5 rounded bg-black/75 border border-amber-500/50 text-amber-300 text-xs cursor-pointer hover:bg-black inline-flex items-center gap-1"
        >
          <Upload size={13} />
          <span className="hidden sm:inline text-[10px]">Tải ảnh</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        </label>

        {onRunTest && (
          <button
            onClick={onRunTest}
            title="Chạy Run Test Tự Động"
            className="px-2 py-1 rounded bg-amber-700/80 border border-amber-400 text-amber-100 text-[10px] font-bold hover:bg-amber-600 inline-flex items-center gap-1"
          >
            <Sparkles size={11} />
            <span>Run Test</span>
          </button>
        )}

        <button
          onClick={() => setShowToolbar(!showToolbar)}
          title={showToolbar ? 'Ẩn thanh công cụ khi lên sóng' : 'Hiện thanh công cụ'}
          className="p-1.5 rounded bg-black/75 border border-amber-500/50 text-amber-300 text-xs hover:bg-black"
        >
          {showToolbar ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>

      {/* TOP HEADER: TEMPLE TITLE & STATS */}
      <div className="relative z-10 text-center pt-3 pb-1 shrink-0">
        <div className="inline-block bg-gradient-to-r from-[#441905ea] via-[#752f08f0] to-[#441905ea] border-2 border-amber-400/90 rounded-full px-5 py-1 shadow-2xl backdrop-blur-sm">
          <h1 className="text-[15px] sm:text-[17px] font-extrabold text-amber-200 tracking-wider font-buddhist drop-shadow-md">
            ☸ THIỀN ĐƯỜNG TỊNH TÂM ☸
          </h1>
          <p className="text-[9.5px] text-amber-300/90 font-medium tracking-wide">
            Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex justify-center items-center gap-2 mt-1.5 text-[10px] font-bold">
          <div className="bg-black/75 border border-amber-500/60 px-2.5 py-0.5 rounded-full text-amber-200 shadow">
            🧘 {devotees.length}/{maxSlots} đang thiền
          </div>
          <div className="bg-black/75 border border-amber-500/60 px-2.5 py-0.5 rounded-full text-amber-300 shadow">
            🕯️ {incenseCount} nén tâm hương
          </div>
        </div>
      </div>

      {/* SANCTUARY UPPER AREA: HALO + BUDDHA STATUE AURA + INCENSE ALTAR + MERIT BOX */}
      <div className="relative h-[37%] flex flex-col items-center justify-end pb-1.5 shrink-0 z-20">
        {/* Divine Glowing Halo behind Buddha head */}
        <div
          className="absolute top-[8%] w-36 h-36 rounded-full blur-xl animate-halo pointer-events-none"
          style={{ background: currentTheme.haloColor }}
        />

        {/* LEFT GUIDE PANEL (Bảng hướng dẫn gõ lệnh phòng live) */}
        <div className="absolute left-2 top-[24%] w-24 sm:w-28 bg-[#180d05e6] border border-amber-500/60 rounded-md p-1.5 text-[8px] sm:text-[9px] leading-tight text-amber-100 shadow-xl backdrop-blur-xs z-30 pointer-events-none">
          <div className="font-bold text-amber-300 border-b border-amber-500/30 pb-0.5 mb-1">
            💬 LỆNH PHÒNG LIVE
          </div>
          <p>• Chat bất kỳ vào bồ đoàn</p>
          <p>• Gõ <b className="text-amber-300">"thắp hương"</b> dâng lễ</p>
          <p>• Gõ <b className="text-amber-300">sư / ni / cổ phục</b></p>
          <p>• 🎁 <b className="text-amber-300">Tặng quà</b> vào Hòm</p>
        </div>

        {/* RIGHT MERIT BOX (Hòm Công Đức sơn son thếp vàng & Bảng vinh danh) */}
        <div className="absolute right-2 top-[20%] w-26 sm:w-30 bg-[#220d04f2] border-2 border-amber-400 rounded-md p-1.5 text-center shadow-[0_0_15px_rgba(243,168,51,0.4)] z-30">
          {/* Visual Merit Box */}
          <div
            className={`relative bg-gradient-to-b from-[#8f1e1e] to-[#4d0b0b] border-2 border-amber-400 rounded p-1.5 mb-1 transition-transform ${
              boxShake ? 'animate-box-shake ring-2 ring-amber-300' : ''
            }`}
          >
            {/* Coin particles bursting on gift */}
            {coinParticles.map(p => (
              <div
                key={p.id}
                className="absolute -top-3 w-4 h-4 bg-amber-300 text-amber-900 font-extrabold text-[9px] rounded-full flex items-center justify-center border border-amber-100 shadow-lg animate-coin-pop pointer-events-none"
                style={{ left: `${p.left}%` }}
              >
                🪙
              </div>
            ))}
            <div className="w-8 h-1 bg-[#100502] border border-amber-300 rounded-full mx-auto mb-1" />
            <div className="text-[8.5px] sm:text-[9.5px] font-black text-amber-200 tracking-wider">
              ⛩️ HÒM CÔNG ĐỨC
            </div>
            <div className="text-[10.5px] sm:text-[12px] font-black text-emerald-400 drop-shadow">
              {meritTotal.toLocaleString()} Xu
            </div>
          </div>

          <div className="text-[7.5px] sm:text-[8.5px] text-amber-300 font-bold mb-0.5 tracking-tight">
            ✦ BẢNG CÔNG ĐỨC ✦
          </div>
          <div className="max-h-14 overflow-hidden text-left text-[7.5px] text-amber-100/90 border-t border-amber-700/50 pt-0.5 space-y-0.5">
            {meritList.length > 0 ? (
              meritList.slice(0, 4).map((m, idx) => (
                <div key={idx} className="truncate">
                  💛 <b>{m.nickname}</b>: +{m.coins}
                </div>
              ))
            ) : (
              <div className="text-amber-400/60 italic text-center text-[7px]">
                Đang chờ thí chủ...
              </div>
            )}
          </div>
        </div>

        {/* BRONZE INCENSE BURNER & SMOKE ALTAR (Lư Hương Đồng Tam Bảo) */}
        <div className="relative flex flex-col items-center z-20">
          {/* Rising Incense Smoke */}
          <div className="relative w-16 h-20 -mb-2 pointer-events-none overflow-visible">
            <div className="absolute bottom-0 left-[48%] w-3 h-3 bg-white/40 rounded-full blur-[4px] animate-smoke-1" />
            <div className="absolute bottom-0 left-[38%] w-3.5 h-3.5 bg-amber-100/35 rounded-full blur-[5px] animate-smoke-2" />
            <div className="absolute bottom-0 left-[58%] w-3 h-3 bg-white/30 rounded-full blur-[4px] animate-smoke-3" />
          </div>

          {/* Incense Sticks burning in the pot */}
          <div className="flex gap-1 items-end justify-center h-6 px-3 z-10">
            {[...Array(stickCount)].map((_, i) => (
              <div
                key={i}
                className="relative w-0.5 bg-red-700 rounded-xs"
                style={{ height: `${16 + (i % 4) * 2}px` }}
              >
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_6px_#ff793f,0_0_10px_#ffb142] animate-pulse" />
              </div>
            ))}
          </div>

          {/* Antique Bronze Incense Pot (Lư Đồng) */}
          <div className="relative w-20 h-7 bg-gradient-to-r from-[#6e3c0d] via-[#d6963e] to-[#6e3c0d] border-2 border-amber-300 rounded-b-xl shadow-2xl flex items-center justify-center">
            <div className="text-[8px] font-black text-[#311403] tracking-widest">
              LƯ ĐỒNG
            </div>
          </div>
        </div>

        {/* CHIEF WORSHIPPER STANDING BEFORE THE ALTAR (Vị trí Chủ Lễ: 'Mih Tuu') */}
        {chiefDevotee && (
          <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 z-30">
            <DevoteeFigure
              nickname={chiefDevotee.nickname}
              avatar={chiefDevotee.avatar}
              skin={chiefDevotee.skin}
              prayer={chiefDevotee.prayer}
              isStanding={true}
              isChief={true}
              showPrayer={true}
            />
          </div>
        )}
      </div>

      {/* SO HOI HUONG TOAST POPUP BANNER */}
      {toast && (
        <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] max-w-[340px] bg-gradient-to-br from-[#681313f8] to-[#3a0606f8] border-2 border-amber-300 rounded-xl p-3 text-center shadow-[0_0_30px_rgba(255,215,0,0.85)] z-50 animate-bounce duration-300 pointer-events-none">
          <h3 className="text-amber-300 font-extrabold text-[12px] sm:text-[13px] tracking-wider mb-1 font-buddhist">
            {toast.title}
          </h3>
          <p className="text-white text-[10px] sm:text-[11px] leading-snug font-medium">
            {toast.message}
          </p>
        </div>
      )}

      {/* SEATING SANCTUARY: 2 WINGS (LEFT & RIGHT) + CENTER RED CARPET AISLE */}
      <div className="relative flex-1 px-2 pt-5 pb-1 overflow-hidden z-20 flex">
        {/* Left Wing Seating */}
        <div
          className={`flex-1 grid ${getColSpan()} auto-rows-max items-end justify-items-center gap-y-2 overflow-y-auto pr-1`}
        >
          {seatedDevotees
            .filter((_, idx) => idx % 2 === 0)
            .map((devotee) => (
              <div key={devotee.id} className="relative flex flex-col items-center">
                <DevoteeFigure
                  nickname={devotee.nickname}
                  avatar={devotee.avatar}
                  skin={devotee.skin}
                  prayer={devotee.prayer}
                  isStanding={false}
                  showPrayer={Boolean(devotee.prayer && devotee.incenseLit)}
                />
                {/* Round meditation cushion (Bồ Đoàn Vàng) */}
                <div className="w-8 sm:w-10 h-3.5 bg-gradient-to-b from-amber-500 to-amber-800 border border-amber-300 rounded-full shadow-md -mt-1" />
              </div>
            ))}
        </div>

        {/* Center Red Carpet Aisle (Lối đi Thảm Đỏ Lễ Phật) */}
        <div className="relative w-18 sm:w-22 h-full mx-1 flex flex-col items-center justify-end">
          {/* Red Carpet Floor Texture */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-[#64100c] via-[#851610] to-[#500c09] border-x-2 border-amber-400/80 shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] opacity-90 rounded-t-sm" />

          {/* Walking Pilgrim along the Red Carpet */}
          {activeWalkingPilgrim && (
            <div className="absolute animate-walk-carpet z-40">
              <DevoteeFigure
                nickname={activeWalkingPilgrim.nickname}
                skin={activeWalkingPilgrim.skin}
                prayer={activeWalkingPilgrim.prayer}
                isStanding={true}
                showPrayer={true}
              />
            </div>
          )}
        </div>

        {/* Right Wing Seating */}
        <div
          className={`flex-1 grid ${getColSpan()} auto-rows-max items-end justify-items-center gap-y-2 overflow-y-auto pl-1`}
        >
          {seatedDevotees
            .filter((_, idx) => idx % 2 !== 0)
            .map((devotee) => (
              <div key={devotee.id} className="relative flex flex-col items-center">
                <DevoteeFigure
                  nickname={devotee.nickname}
                  avatar={devotee.avatar}
                  skin={devotee.skin}
                  prayer={devotee.prayer}
                  isStanding={false}
                  showPrayer={Boolean(devotee.prayer && devotee.incenseLit)}
                />
                {/* Round meditation cushion (Bồ Đoàn Vàng) */}
                <div className="w-8 sm:w-10 h-3.5 bg-gradient-to-b from-amber-500 to-amber-800 border border-amber-300 rounded-full shadow-md -mt-1" />
              </div>
            ))}
        </div>
      </div>

      {/* BOTTOM HUD: GIFT ACTION CARDS & LEADERBOARD (TẤM LÒNG THÀNH) */}
      <div className="relative z-30 px-2 pb-2 pt-1 shrink-0 grid grid-cols-5 gap-1.5">
        {/* Left: Recent Buddhist Ticker & Gift Quick Cards */}
        <div className="col-span-3 bg-[#130904ea] border border-amber-500/70 rounded-lg p-1.5 flex flex-col justify-between shadow-lg">
          <div className="text-[8.5px] sm:text-[9.5px] font-bold text-amber-200 truncate text-center mb-1">
            ☸ Thành tâm kính lễ Đức Bổn Sư Thích Ca Mâu Ni Phật ☸
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div className="bg-[#2a170ef0] border border-amber-500/40 rounded p-1 flex items-center gap-1">
              <span className="text-xs">🕯️</span>
              <div className="leading-none truncate">
                <div className="text-[6.5px] font-bold text-amber-400">1 COIN</div>
                <div className="text-[7.5px] font-semibold text-white truncate">Dâng hương</div>
              </div>
            </div>

            <div className="bg-[#2a170ef0] border border-amber-500/40 rounded p-1 flex items-center gap-1">
              <span className="text-xs">🪷</span>
              <div className="leading-none truncate">
                <div className="text-[6.5px] font-bold text-amber-400">5 COINS</div>
                <div className="text-[7.5px] font-semibold text-white truncate">Lễ Phật</div>
              </div>
            </div>

            <div className="bg-[#2a170ef0] border border-amber-500/40 rounded p-1 flex items-center gap-1">
              <span className="text-xs">💐</span>
              <div className="leading-none truncate">
                <div className="text-[6.5px] font-bold text-amber-400">10+ COIN</div>
                <div className="text-[7.5px] font-semibold text-white truncate">Hoa sen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: TẤM LÒNG THÀNH Leaderboard */}
        <div className="col-span-2 bg-[#130904ea] border border-amber-500/80 rounded-lg p-1.5 flex flex-col justify-between shadow-lg">
          <div className="text-[8.5px] sm:text-[9.5px] font-black text-amber-300 text-center border-b border-amber-600/40 pb-0.5">
            TẤM LÒNG THÀNH ({meritTotal})
          </div>

          <div className="text-[7.5px] sm:text-[8px] space-y-0.5 text-amber-100 font-medium">
            {meritList.length > 0 ? (
              meritList.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="truncate pr-1">
                    {['①', '②', '③'][idx]} {item.nickname}
                  </span>
                  <b className="text-amber-300 shrink-0">{item.coins}</b>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between">
                  <span>① Đế Chinvn</span>
                  <b className="text-amber-300">19</b>
                </div>
                <div className="flex justify-between">
                  <span>② HungDat</span>
                  <b className="text-amber-300">9</b>
                </div>
                <div className="flex justify-between">
                  <span>③ Tôi nghèo</span>
                  <b className="text-amber-300">7</b>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
