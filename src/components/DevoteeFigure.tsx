import React from 'react';
import { SkinType } from '../types';

interface DevoteeFigureProps {
  nickname: string;
  avatar?: string;
  skin: SkinType;
  prayer?: string;
  isStanding?: boolean;
  showPrayer?: boolean;
  isChief?: boolean;
  className?: string;
}

export const DevoteeFigure: React.FC<DevoteeFigureProps> = ({
  nickname,
  avatar,
  skin,
  prayer,
  isStanding = false,
  showPrayer = true,
  isChief = false,
  className = '',
}) => {
  // Avatar fallback with deterministic seed
  const avatarUrl =
    avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`;

  // Color schemes for robes
  const getSkinColors = (type: SkinType) => {
    switch (type) {
      case 'su_thay': // Golden Saffron Kāsāya
        return {
          top: '#e59b36',
          mid: '#c5842b',
          bot: '#8f5615',
          stroke: '#663908',
          head: '#2d1e15',
          isMonk: true,
        };
      case 'su_co': // Gray-Blue Nun Robe
        return {
          top: '#93a0b5',
          mid: '#6e7b92',
          bot: '#485366',
          stroke: '#343c4c',
          head: '#221e1d',
          isMonk: true,
        };
      case 'co_phuc': // Traditional Embroidered Silk Red/Plum
        return {
          top: '#b83b3b',
          mid: '#8a2323',
          bot: '#571414',
          stroke: '#3b0a0a',
          head: '#1c1514',
          isMonk: false,
        };
      case 'phattu_ao_lam': // Classic Vietnamese Blue-Gray Temple Robe
      default:
        return {
          top: '#a0acbf',
          mid: '#76849b',
          bot: '#505c70',
          stroke: '#374150',
          head: '#1b1716',
          isMonk: false,
        };
    }
  };

  const colors = getSkinColors(skin);

  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none transition-transform ${className}`}
    >
      {/* Floating Prayer Speech Bubble */}
      {showPrayer && prayer && (
        <div className="absolute bottom-[98%] mb-1.5 z-20 animate-float-bubble pointer-events-none max-w-[110px] w-max">
          <div className="bg-[#18100ae0] backdrop-blur-sm border border-amber-400/70 text-[#fbebd0] text-[8.5px] font-semibold px-2 py-0.5 rounded shadow-lg text-center leading-tight whitespace-normal break-words">
            {prayer}
          </div>
          <div className="w-1.5 h-1.5 bg-[#18100ae0] border-r border-b border-amber-400/70 transform rotate-45 mx-auto -mt-0.5"></div>
        </div>
      )}

      {/* Back-view SVG figure */}
      <div className={`relative ${isStanding ? 'w-14 h-20' : 'w-10 h-13'} animate-gentle-bow`}>
        {isStanding ? (
          // Standing pilgrim back view (dáng đứng chắp tay dâng hương)
          <svg viewBox="0 0 80 120" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
            <defs>
              <linearGradient id={`robeStand-${skin}-${nickname}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors.top} />
                <stop offset="50%" stopColor={colors.mid} />
                <stop offset="100%" stopColor={colors.bot} />
              </linearGradient>
            </defs>

            {/* Head & Hair */}
            {colors.isMonk ? (
              // Shaved monk head
              <ellipse cx="40" cy="20" rx="9.5" ry="11" fill="#755a4c" />
            ) : (
              // Traditional hair bun
              <>
                <circle cx="40" cy="11" r="5" fill={colors.head} />
                <ellipse cx="40" cy="21" rx="9.5" ry="10.5" fill={colors.head} />
              </>
            )}

            {/* Back Neck & Collar */}
            <path d="M34 29 Q40 32 46 29 L48 35 Q40 37 32 35 Z" fill={colors.stroke} />

            {/* Flowing Back Robe */}
            <path
              d="M32 34 Q40 37 48 34 L64 58 L56 64 L52 54 L60 114 L20 114 L28 54 L24 64 L16 58 Z"
              fill={`url(#robeStand-${skin}-${nickname})`}
              stroke={colors.stroke}
              strokeWidth="1.2"
            />

            {/* Center seam & drapery folds */}
            <line x1="40" y1="36" x2="40" y2="113" stroke={colors.stroke} strokeWidth="1.2" opacity="0.65" />
            <line x1="33" y1="42" x2="28" y2="110" stroke={colors.stroke} strokeWidth="0.8" opacity="0.5" />
            <line x1="47" y1="42" x2="52" y2="110" stroke={colors.stroke} strokeWidth="0.8" opacity="0.5" />
          </svg>
        ) : (
          // Sitting meditating back view (dáng ngồi thiền xếp bằng trang nghiêm trên bồ đoàn)
          <svg viewBox="0 0 70 85" className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id={`robeSit-${skin}-${nickname}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.top} />
                <stop offset="55%" stopColor={colors.mid} />
                <stop offset="100%" stopColor={colors.bot} />
              </linearGradient>
            </defs>

            {/* Head & Hair / Bun */}
            {colors.isMonk ? (
              <ellipse cx="35" cy="16" rx="8" ry="9" fill="#755a4c" />
            ) : (
              <>
                <circle cx="35" cy="8" r="4.5" fill={colors.head} />
                <ellipse cx="35" cy="17" rx="8" ry="8.8" fill={colors.head} />
              </>
            )}

            {/* Neck / Collar */}
            <path d="M29 23 Q35 25 41 23 L43 27 Q35 29 27 27 Z" fill={colors.stroke} />

            {/* Seated Buddhist Robe spreading on cushion */}
            <path
              d="M27 26 Q35 29 43 26 L56 46 Q62 66 52 77 L18 77 Q8 66 14 46 Z"
              fill={`url(#robeSit-${skin}-${nickname})`}
              stroke={colors.stroke}
              strokeWidth="1.1"
            />

            {/* Pleats and back lines */}
            <line x1="35" y1="28" x2="35" y2="76" stroke={colors.stroke} strokeWidth="1" opacity="0.6" />
            <path d="M25 38 Q22 55 20 74" stroke={colors.stroke} strokeWidth="0.8" opacity="0.5" fill="none" />
            <path d="M45 38 Q48 55 50 74" stroke={colors.stroke} strokeWidth="0.8" opacity="0.5" fill="none" />
          </svg>
        )}
      </div>

      {/* TikTok Nameplate with mini avatar badge */}
      <div
        className={`inline-flex items-center gap-1 bg-[#120a06ec] border ${
          isChief ? 'border-amber-400 ring-1 ring-amber-300/40' : 'border-amber-400/50'
        } rounded-full py-0.5 px-1.5 -mt-1.5 z-10 shadow-md max-w-[80px]`}
      >
        <img
          src={avatarUrl}
          alt={nickname}
          className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/70 shrink-0"
        />
        <span className="text-[7.5px] font-bold text-amber-200 truncate leading-none">
          {nickname}
        </span>
      </div>
    </div>
  );
};
