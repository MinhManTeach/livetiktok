import React from 'react';
import { Devotee } from '../types';
import { DevoteeFigure } from './DevoteeFigure';

interface SeatingWingProps {
  devotees: Devotee[];
  cols: number;
  // Which side of the red carpet this wing is on (columns converge toward the aisle in the distance)
  side: 'left' | 'right';
}

// Row bases as % of the wing height: first row sits on the hall floor (below the altar table),
// later rows come toward the camera. Spacing tightens when there are many rows.
const FIRST_ROW = 45;
const LAST_ROW = 99;
const MAX_STEP = 13;
// Only recent prayers get a speech bubble, so a full hall isn't buried under bubbles
const BUBBLE_MS = 30000;

/**
 * One side of the hall: devotees sit on cushions in rows from the altar toward the camera,
 * with perspective (rows near the altar are smaller and closer to the aisle).
 */
export const SeatingWing: React.FC<SeatingWingProps> = ({ devotees, cols, side }) => {
  // Re-check every few seconds so prayer bubbles fade out once they are no longer recent
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const rows: Devotee[][] = [];
  for (let i = 0; i < devotees.length; i += cols) rows.push(devotees.slice(i, i + cols));

  const step = rows.length > 1 ? Math.min(MAX_STEP, (LAST_ROW - FIRST_ROW) / (rows.length - 1)) : 0;

  return (
    <div className="relative flex-1 h-full">
      {rows.map((row, r) => {
        const base = FIRST_ROW + r * step;
        const depth = (base - FIRST_ROW) / (LAST_ROW - FIRST_ROW); // 0 = near altar, 1 = near camera
        const scale = 0.72 + 0.33 * depth;
        const spread = 0.8 + 0.2 * depth;
        // Distant rows lean toward the carpet: left wing toward its right edge, right wing toward its left
        const shift = (1 - spread) * 50 * (side === 'left' ? 1 : -1);

        return row.map((devotee, c) => {
          const x = 50 + ((c + 0.5) / cols) * 100 * spread - 50 * spread + shift;
          return (
            <div
              key={devotee.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${x}%`,
                top: `${base}%`,
                transform: `translate(-50%, -100%) scale(${scale})`,
                transformOrigin: 'bottom center',
                zIndex: 10 + r,
              }}
            >
              <DevoteeFigure
                nickname={devotee.nickname}
                avatar={devotee.avatar}
                skin={devotee.skin}
                prayer={devotee.prayer}
                isStanding={false}
                showPrayer={Boolean(devotee.prayer && devotee.incenseLit && now - devotee.timestamp < BUBBLE_MS)}
              />
              {/* Round meditation cushion (Bồ Đoàn Vàng) */}
              <div className="w-8 sm:w-10 h-3.5 bg-gradient-to-b from-amber-500 to-amber-800 border border-amber-300 rounded-full shadow-md -mt-1" />
            </div>
          );
        });
      })}
    </div>
  );
};
