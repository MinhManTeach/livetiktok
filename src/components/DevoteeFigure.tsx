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
  prayer,
  isStanding = false,
  showPrayer = true,
  isChief = false,
  className = '',
}) => {
  // Avatar fallback with deterministic seed
  const avatarUrl =
    avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`;

  // Every devotee wears the lay Buddhist áo tràng lam (the `skin` prop is kept for data compatibility)
  const lam = { light: '#9db4cc', mid: '#7593b2', dark: '#56718f', stroke: '#3b5068', collar: '#435c78' };
  const hair = '#1c1511';
  const skinTone = '#c99a78';

  // SVG ids must not contain spaces/diacritics from viewer names, or url(#id) fails and the robe renders black
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const robeId = `robe-${uid}`;
  const sleeveId = `sleeve-${uid}`;
  const cushionId = `cushion-${uid}`;

  // Stable per-name hairstyle: hair bun or short hair
  const hasBun = [...nickname].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 2 === 0;

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

      {/* Back-view SVG figure in áo tràng lam */}
      <div className={`relative ${isStanding ? 'w-14 h-20' : 'w-10 h-13'} animate-gentle-bow`}>
        <svg
          viewBox={isStanding ? '0 0 80 120' : '0 0 70 85'}
          className={`w-full h-full ${
            isStanding ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]' : 'drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]'
          }`}
        >
          <defs>
            <linearGradient id={robeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lam.light} />
              <stop offset="55%" stopColor={lam.mid} />
              <stop offset="100%" stopColor={lam.dark} />
            </linearGradient>
            <linearGradient id={sleeveId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lam.mid} />
              <stop offset="100%" stopColor={lam.stroke} />
            </linearGradient>
            <radialGradient id={cushionId} cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#c08a3e" />
              <stop offset="100%" stopColor="#6b4317" />
            </radialGradient>
          </defs>

          {isStanding ? (
            // Standing back view (dáng đứng chắp tay dâng hương), áo tràng dài tới chân
            <g>
              <path
                d="M30 34 Q40 31 50 34 Q58 38 60 50 L64 112 Q40 117 16 112 L20 50 Q22 38 30 34 Z"
                fill={`url(#${robeId})`}
                stroke={lam.stroke}
                strokeWidth="1"
              />
              {/* Wide sleeves (tay áo tràng rộng) */}
              <path d="M22 40 Q11 58 13 84 Q19 89 25 84 Q23 62 27 46 Z" fill={`url(#${sleeveId})`} stroke={lam.stroke} strokeWidth="0.8" />
              <path d="M58 40 Q69 58 67 84 Q61 89 55 84 Q57 62 53 46 Z" fill={`url(#${sleeveId})`} stroke={lam.stroke} strokeWidth="0.8" />
              {/* Back seam & folds */}
              <line x1="40" y1="36" x2="40" y2="114" stroke={lam.stroke} strokeWidth="0.9" opacity="0.55" />
              <path d="M32 52 Q29 80 27 111" stroke={lam.stroke} strokeWidth="0.7" opacity="0.4" fill="none" />
              <path d="M48 52 Q51 80 53 111" stroke={lam.stroke} strokeWidth="0.7" opacity="0.4" fill="none" />
              {/* Shoulder light */}
              <path d="M30 36 Q40 33 50 36" stroke="#d6e2ee" strokeWidth="1" opacity="0.45" fill="none" />
              {/* Neck, stand collar, head */}
              <ellipse cx="40" cy="29" rx="4.5" ry="3.5" fill={skinTone} />
              <path d="M31 31 Q40 36 49 31 L49 27 Q40 31 31 27 Z" fill={lam.collar} />
              {!hasBun && <ellipse cx="30.8" cy="20" rx="1.6" ry="2.6" fill={skinTone} />}
              {!hasBun && <ellipse cx="49.2" cy="20" rx="1.6" ry="2.6" fill={skinTone} />}
              <ellipse cx="40" cy="19" rx="9.5" ry="10.5" fill={hair} />
              <ellipse cx="37" cy="14" rx="4" ry="2.5" fill="#3a2d25" opacity="0.6" />
              {hasBun && <circle cx="40" cy="9" r="5" fill={hair} />}
            </g>
          ) : (
            // Seated meditation back view on a bồ đoàn cushion
            <g>
              <ellipse cx="35" cy="78" rx="28" ry="6.5" fill={`url(#${cushionId})`} />
              <ellipse cx="35" cy="76.5" rx="22" ry="3.2" fill="#d8a95a" opacity="0.35" />
              <path
                d="M24 29 Q35 26 46 29 Q55 33 57 44 Q60 60 63 74 Q49 80 35 80 Q21 80 7 74 Q10 60 13 44 Q15 33 24 29 Z"
                fill={`url(#${robeId})`}
                stroke={lam.stroke}
                strokeWidth="1"
              />
              {/* Wide sleeves resting on the lap */}
              <path d="M15 40 Q6 54 7 71 Q12 75 18 71 Q17 56 20 45 Z" fill={`url(#${sleeveId})`} stroke={lam.stroke} strokeWidth="0.7" />
              <path d="M55 40 Q64 54 63 71 Q58 75 52 71 Q53 56 50 45 Z" fill={`url(#${sleeveId})`} stroke={lam.stroke} strokeWidth="0.7" />
              {/* Back seam & folds */}
              <line x1="35" y1="30" x2="35" y2="78" stroke={lam.stroke} strokeWidth="0.9" opacity="0.55" />
              <path d="M27 40 Q24 58 22 76" stroke={lam.stroke} strokeWidth="0.7" opacity="0.4" fill="none" />
              <path d="M43 40 Q46 58 48 76" stroke={lam.stroke} strokeWidth="0.7" opacity="0.4" fill="none" />
              {/* Shoulder light */}
              <path d="M24 31 Q35 28 46 31" stroke="#d6e2ee" strokeWidth="1" opacity="0.45" fill="none" />
              {/* Neck, stand collar, head */}
              <ellipse cx="35" cy="24" rx="4" ry="3" fill={skinTone} />
              <path d="M27 26 Q35 30.5 43 26 L43 22.5 Q35 26 27 22.5 Z" fill={lam.collar} />
              {!hasBun && <ellipse cx="26.6" cy="15.5" rx="1.4" ry="2.3" fill={skinTone} />}
              {!hasBun && <ellipse cx="43.4" cy="15.5" rx="1.4" ry="2.3" fill={skinTone} />}
              <ellipse cx="35" cy="15" rx="8.5" ry="9.3" fill={hair} />
              <ellipse cx="32.5" cy="10.5" rx="3.5" ry="2.2" fill="#3a2d25" opacity="0.6" />
              {hasBun && <circle cx="35" cy="6.5" r="4.3" fill={hair} />}
            </g>
          )}
        </svg>
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
