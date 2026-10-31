import React from 'react';

interface IncenseBurnerProps {
  stickCount: number;
}

/**
 * Bát hương đồng trước bàn thờ: thân đồng có dải hoa văn & chân, mặt tro,
 * nhang chân đỏ thân nâu với đầu than hồng, khói mảnh uốn lượn bay lên.
 */
export const IncenseBurner: React.FC<IncenseBurnerProps> = ({ stickCount }) => {
  // SVG ids must be unique per instance (the Dashboard can show two overlays at once)
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const bronzeId = `bronze-${uid}`;
  const rimId = `rim-${uid}`;
  const glowId = `glow-${uid}`;
  const smokeBlurId = `smokeBlur-${uid}`;

  const RIM_Y = 78; // ash surface where the sticks stand
  const spacing = Math.min(4.6, 58 / Math.max(stickCount, 1));
  const sticks = [...Array(stickCount)].map((_, i) => {
    const offset = i - (stickCount - 1) / 2;
    const x = 50 + offset * spacing;
    const top = 40 + ((i * 7) % 5) * 1.6; // uneven burn lengths look natural
    const tilt = offset * 1.4; // sticks fan out slightly
    return { x, top, tilt };
  });

  // Smoke rises from a few stick tips
  const smokeFrom = [sticks[0], sticks[Math.floor(stickCount / 2)], sticks[stickCount - 1]].filter(Boolean);

  return (
    <div className="relative flex flex-col items-center z-20 pointer-events-none -translate-y-9">
      <svg viewBox="0 0 100 116" className="w-[104px] h-[120px] overflow-visible">
        <defs>
          <linearGradient id={bronzeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a2706" />
            <stop offset="28%" stopColor="#b97a2c" />
            <stop offset="45%" stopColor="#f0c069" />
            <stop offset="62%" stopColor="#a8661c" />
            <stop offset="100%" stopColor="#3f2105" />
          </linearGradient>
          <linearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7dc8f" />
            <stop offset="100%" stopColor="#9c5f17" />
          </linearGradient>
          <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={smokeBlurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.9" />
          </filter>
        </defs>

        {/* Smoke wisps */}
        <g filter={`url(#${smokeBlurId})`}>
          {smokeFrom.map((s, i) => (
            <path
              key={i}
              className="animate-smoke-wisp"
              style={{ animationDelay: `${i * 1.4}s`, animationDuration: `${4.2 + i * 0.6}s` }}
              d={`M${s.x} ${s.top - 2} C${s.x - 5} ${s.top - 12}, ${s.x + 6} ${s.top - 20}, ${s.x} ${s.top - 30} S${s.x - 4} ${s.top - 44}, ${s.x + 3} ${s.top - 52}`}
              stroke="rgba(236, 230, 220, 0.75)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* Incense sticks */}
        {sticks.map(({ x, top, tilt }, i) => (
          <g key={i} transform={`rotate(${tilt} ${x} ${RIM_Y})`}>
            {/* Red stem (chân nhang) */}
            <line x1={x} y1={RIM_Y} x2={x} y2={RIM_Y - 12} stroke="#b3261e" strokeWidth="1.3" />
            {/* Incense body */}
            <line x1={x} y1={RIM_Y - 12} x2={x} y2={top + 2.5} stroke="#5b3a29" strokeWidth="1.9" strokeLinecap="round" />
            {/* Ash and glowing ember tip */}
            <line x1={x} y1={top + 2.5} x2={x} y2={top + 0.8} stroke="#d4cdc2" strokeWidth="1.9" />
            <circle cx={x} cy={top} r="1.25" fill="#ff7a2e" filter={`url(#${glowId})`} className="animate-pulse" />
          </g>
        ))}

        {/* Bowl feet */}
        <path d="M30 104 L27 112 L35 112 L37 104 Z" fill="#6b3d0c" />
        <path d="M63 104 L65 112 L73 112 L70 104 Z" fill="#6b3d0c" />
        <path d="M46 106 L45 113 L55 113 L54 106 Z" fill="#7a4610" />

        {/* Bowl body */}
        <path
          d={`M13 ${RIM_Y} Q13 ${RIM_Y + 18} 30 ${RIM_Y + 26} Q50 ${RIM_Y + 31} 70 ${RIM_Y + 26} Q87 ${RIM_Y + 18} 87 ${RIM_Y} Z`}
          fill={`url(#${bronzeId})`}
          stroke="#5a3108"
          strokeWidth="0.8"
        />
        {/* Decorative band with lotus medallion */}
        <path d={`M16 ${RIM_Y + 8} Q50 ${RIM_Y + 13} 84 ${RIM_Y + 8}`} stroke="#5a3108" strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d={`M19 ${RIM_Y + 13} Q50 ${RIM_Y + 18} 81 ${RIM_Y + 13}`} stroke="#5a3108" strokeWidth="0.8" fill="none" opacity="0.8" />
        {[24, 34, 66, 76].map((cx) => (
          <circle key={cx} cx={cx} cy={RIM_Y + 11.2 + (cx === 34 || cx === 66 ? 1 : 0)} r="1.3" fill="#f3cf7a" opacity="0.85" />
        ))}
        <g transform={`translate(50 ${RIM_Y + 12})`} fill="#f7d98a" stroke="#6b3d0c" strokeWidth="0.4">
          <ellipse cx="0" cy="-1.5" rx="2" ry="4" />
          <ellipse cx="-3.2" cy="0" rx="1.6" ry="3.4" transform="rotate(-35 -3.2 0)" />
          <ellipse cx="3.2" cy="0" rx="1.6" ry="3.4" transform="rotate(35 3.2 0)" />
        </g>
        {/* Soft highlight */}
        <path d={`M30 ${RIM_Y + 4} Q31 ${RIM_Y + 18} 38 ${RIM_Y + 24}`} stroke="#fff4d6" strokeWidth="2" opacity="0.25" fill="none" strokeLinecap="round" />

        {/* Rim and ash surface */}
        <ellipse cx="50" cy={RIM_Y} rx="38" ry="5.2" fill={`url(#${rimId})`} stroke="#6b3d0c" strokeWidth="0.8" />
        <ellipse cx="50" cy={RIM_Y + 0.4} rx="33.5" ry="3.6" fill="#8d857a" />
        <ellipse cx="48" cy={RIM_Y - 0.2} rx="24" ry="2" fill="#b3aa9d" opacity="0.7" />

        {/* Sticks re-drawn at the ash line so their bases sit inside the bowl */}
        {sticks.map(({ x, tilt }, i) => (
          <line
            key={`base-${i}`}
            transform={`rotate(${tilt} ${x} ${RIM_Y})`}
            x1={x}
            y1={RIM_Y + 0.6}
            x2={x}
            y2={RIM_Y - 3}
            stroke="#b3261e"
            strokeWidth="1.3"
          />
        ))}
      </svg>
    </div>
  );
};
