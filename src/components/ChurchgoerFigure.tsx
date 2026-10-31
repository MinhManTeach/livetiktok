import React from 'react';

interface ChurchgoerFigureProps {
  nickname: string;
  prayer?: string;
  showPrayer?: boolean;
  isStanding?: boolean;
  className?: string;
}

// Mass clothes, chosen per name: men in a white shirt or a dark suit, women in áo dài with a white lace veil
const OUTFITS = [
  { kind: 'man', top: '#f4f3ee', shade: '#c9c6bb', collar: '#ffffff' },
  { kind: 'man', top: '#2f4060', shade: '#1d2a40', collar: '#f4f3ee' },
  { kind: 'woman', top: '#a9c9e8', shade: '#6f97bf', collar: '#a9c9e8' },
  { kind: 'woman', top: '#ecb3c1', shade: '#c47f92', collar: '#ecb3c1' },
] as const;

const hair = '#1c1511';
const skinTone = '#d9ad86';

/**
 * Back view of a churchgoer. Seated: upper body only (the pew backrest is drawn in front by ChurchSeating).
 * Standing: full body, used for the person walking up the aisle and the one at the sanctuary steps.
 */
export const ChurchgoerFigure: React.FC<ChurchgoerFigureProps> = ({
  nickname,
  prayer,
  showPrayer = false,
  isStanding = false,
  className = '',
}) => {
  const hash = [...nickname].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const outfit = OUTFITS[hash % OUTFITS.length];
  const isWoman = outfit.kind === 'woman';
  // SVG ids must not depend on viewer names (spaces/diacritics break url(#id))
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const clothId = `cloth-${uid}`;

  const gradient = (
    <defs>
      <linearGradient id={clothId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={outfit.shade} />
        <stop offset="45%" stopColor={outfit.top} />
        <stop offset="100%" stopColor={outfit.shade} />
      </linearGradient>
    </defs>
  );

  const veil = (cx: number, top: number, w: number, h: number) => (
    <g>
      <path
        d={`M${cx - w * 0.42} ${top + h * 0.25} Q${cx} ${top - h * 0.12} ${cx + w * 0.42} ${top + h * 0.25} Q${cx + w * 0.55} ${top + h * 0.7} ${cx + w * 0.5} ${top + h} Q${cx} ${top + h * 1.08} ${cx - w * 0.5} ${top + h} Q${cx - w * 0.55} ${top + h * 0.7} ${cx - w * 0.42} ${top + h * 0.25} Z`}
        fill="#ffffff"
        opacity="0.88"
      />
      {/* Lace edge */}
      <path
        d={`M${cx - w * 0.5} ${top + h} Q${cx} ${top + h * 1.08} ${cx + w * 0.5} ${top + h}`}
        stroke="#e6e1d6"
        strokeWidth="1.6"
        strokeDasharray="1.5 1.8"
        fill="none"
      />
    </g>
  );

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      {showPrayer && prayer && (
        <div className="absolute bottom-[98%] mb-1 z-20 animate-float-bubble pointer-events-none max-w-[110px] w-max">
          <div className="bg-[#120c1ce6] backdrop-blur-sm border border-amber-300/70 text-[#fbf1dc] text-[8.5px] font-semibold px-2 py-0.5 rounded shadow-lg text-center leading-tight whitespace-normal break-words">
            {prayer}
          </div>
          <div className="w-1.5 h-1.5 bg-[#120c1ce6] border-r border-b border-amber-300/70 transform rotate-45 mx-auto -mt-0.5"></div>
        </div>
      )}

      {isStanding ? (
        <svg viewBox="0 0 80 120" className="w-14 h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]">
          {gradient}
          {isWoman ? (
            <g>
              {/* White trousers under the áo dài */}
              <path d="M30 80 L28 114 L37 114 L40 84 L43 114 L52 114 L50 80 Z" fill="#f2efe6" />
              {/* Áo dài: fitted top, long back panel */}
              <path d="M30 34 Q40 31 50 34 Q55 40 54 60 L56 112 Q40 116 24 112 L26 60 Q25 40 30 34 Z" fill={`url(#${clothId})`} stroke={outfit.shade} strokeWidth="0.8" />
              <path d="M30 36 Q24 50 25 70 L29 70 Q29 52 33 42 Z M50 36 Q56 50 55 70 L51 70 Q51 52 47 42 Z" fill={outfit.shade} opacity="0.6" />
              <line x1="40" y1="36" x2="40" y2="112" stroke={outfit.shade} strokeWidth="0.8" opacity="0.6" />
              <ellipse cx="40" cy="29" rx="4.5" ry="3.5" fill={skinTone} />
              <ellipse cx="40" cy="19" rx="9.5" ry="10.5" fill={hair} />
              {veil(40, 8, 26, 30)}
              <ellipse cx="33" cy="116" rx="5" ry="2.4" fill="#2a1d14" />
              <ellipse cx="47" cy="116" rx="5" ry="2.4" fill="#2a1d14" />
            </g>
          ) : (
            <g>
              {/* Dark trousers and shoes */}
              <path d="M28 70 L27 114 L38 114 L40 78 L42 114 L53 114 L52 70 Z" fill="#26262b" />
              <ellipse cx="32" cy="116" rx="6" ry="2.6" fill="#141416" />
              <ellipse cx="48" cy="116" rx="6" ry="2.6" fill="#141416" />
              {/* Shirt / jacket */}
              <path d="M28 34 Q40 30 52 34 Q60 40 59 56 L56 76 L24 76 L21 56 Q20 40 28 34 Z" fill={`url(#${clothId})`} stroke={outfit.shade} strokeWidth="0.8" />
              <path d="M22 42 Q16 56 19 72 L25 72 Q24 56 27 46 Z M58 42 Q64 56 61 72 L55 72 Q56 56 53 46 Z" fill={outfit.shade} opacity="0.7" />
              <line x1="40" y1="34" x2="40" y2="76" stroke={outfit.shade} strokeWidth="0.8" opacity="0.6" />
              <path d="M34 31 Q40 34 46 31 L46 28 Q40 31 34 28 Z" fill={outfit.collar} />
              <ellipse cx="30.8" cy="20" rx="1.6" ry="2.6" fill={skinTone} />
              <ellipse cx="49.2" cy="20" rx="1.6" ry="2.6" fill={skinTone} />
              <ellipse cx="40" cy="19" rx="9" ry="10" fill={hair} />
              <ellipse cx="37" cy="14" rx="4" ry="2.4" fill="#3a2d25" opacity="0.6" />
            </g>
          )}
        </svg>
      ) : (
        // Seated: head and upper body above the pew
        <svg viewBox="0 0 70 70" className="w-full h-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          {gradient}
          {isWoman ? (
            <g>
              <path d="M17 70 Q15 46 24 38 Q35 33 46 38 Q55 46 53 70 Z" fill={`url(#${clothId})`} stroke={outfit.shade} strokeWidth="0.8" />
              <line x1="35" y1="38" x2="35" y2="70" stroke={outfit.shade} strokeWidth="0.8" opacity="0.6" />
              <ellipse cx="35" cy="31" rx="4" ry="3" fill={skinTone} />
              <ellipse cx="35" cy="21" rx="8.5" ry="9.5" fill={hair} />
              {veil(35, 10, 24, 30)}
            </g>
          ) : (
            <g>
              <path d="M13 70 Q12 45 23 37 Q35 32 47 37 Q58 45 57 70 Z" fill={`url(#${clothId})`} stroke={outfit.shade} strokeWidth="0.8" />
              <line x1="35" y1="37" x2="35" y2="70" stroke={outfit.shade} strokeWidth="0.8" opacity="0.6" />
              <path d="M29 34 Q35 37 41 34 L41 31 Q35 34 29 31 Z" fill={outfit.collar} />
              <ellipse cx="35" cy="29" rx="4" ry="3" fill={skinTone} />
              <ellipse cx="26.6" cy="20" rx="1.4" ry="2.3" fill={skinTone} />
              <ellipse cx="43.4" cy="20" rx="1.4" ry="2.3" fill={skinTone} />
              <ellipse cx="35" cy="19.5" rx="8.5" ry="9.3" fill={hair} />
              <ellipse cx="32.5" cy="15" rx="3.5" ry="2.2" fill="#3a2d25" opacity="0.6" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
