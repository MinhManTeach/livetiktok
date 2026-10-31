import React from 'react';

interface VotiveCandlesProps {
  count: number;
}

/**
 * Giá nến cầu nguyện: a brass stand with tiers of red glass votive candles.
 * The church counterpart of the incense bowl; one candle per prayer, up to 15.
 */
export const VotiveCandles: React.FC<VotiveCandlesProps> = ({ count }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const brassId = `brass-${uid}`;
  const glowId = `vglow-${uid}`;

  // Three tiers, back tier highest; fill the front tier first
  const tiers = [
    { y: 58, x0: 14, x1: 106, max: 6 },
    { y: 44, x0: 22, x1: 98, max: 5 },
    { y: 30, x0: 30, x1: 90, max: 4 },
  ];
  let left = Math.min(15, Math.max(1, count));
  const candles: { x: number; y: number }[] = [];
  tiers.forEach((t) => {
    const n = Math.min(t.max, left);
    left -= n;
    for (let i = 0; i < n; i++) {
      candles.push({ x: t.x0 + ((t.x1 - t.x0) * (i + 0.5)) / t.max, y: t.y });
    }
  });

  return (
    <svg viewBox="0 0 120 92" className="w-[110px] h-[84px] overflow-visible pointer-events-none">
      <defs>
        <linearGradient id={brassId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5d78a" />
          <stop offset="1" stopColor="#9a6a1e" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffb54a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff8a1e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stand: tiers and legs */}
      {tiers.map((t, i) => (
        <rect key={i} x={t.x0 - 6} y={t.y + 7} width={t.x1 - t.x0 + 12} height="4" rx="1.5" fill={`url(#${brassId})`} stroke="#7a5214" strokeWidth="0.6" />
      ))}
      <path d="M10 69 L8 90 M110 69 L112 90 M60 69 L60 90" stroke="#9a6a1e" strokeWidth="2.5" />
      <rect x="4" y="88" width="112" height="4" rx="1.5" fill={`url(#${brassId})`} />

      {/* Candles: red glass cup, small white candle, flame with glow */}
      {candles.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x} cy={y - 4} r="9" fill={`url(#${glowId})`} />
          <path d={`M${x - 5} ${y - 1} L${x - 4} ${y + 7} L${x + 4} ${y + 7} L${x + 5} ${y - 1} Z`} fill="#b3141e" opacity="0.9" stroke="#6e0a10" strokeWidth="0.5" />
          <rect x={x - 3.5} y={y - 2} width="7" height="2" fill="#fbf3e2" />
          <path d={`M${x} ${y - 9} Q${x + 2.2} ${y - 5} ${x} ${y - 2.5} Q${x - 2.2} ${y - 5} ${x} ${y - 9} Z`} fill="#ffd25a" className="animate-pulse" />
        </g>
      ))}
    </svg>
  );
};
