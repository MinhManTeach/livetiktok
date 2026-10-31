import React from 'react';
import { Devotee } from '../types';
import { ChurchgoerFigure } from './ChurchgoerFigure';

// Geometry of the pews in the church background photo (public/backgrounds/nha-tho.png, 1080x1920),
// measured on that image: top edge of each pew backrest, vanishing point, and the aisle's edges.
// Rows below ~1650 are hidden by the overlay's bottom panel, so they are not used.
const BG_W = 1080;
const BG_H = 1920;
const CX = 540;
const VP_Y = 1090;
const PEW_TOPS = [1310, 1327, 1347, 1371, 1400, 1435, 1479, 1537, 1614];
// People per pew on each side at normal capacity (pews near the altar look shorter)
const BASE_CAPACITY = [2, 2, 3, 3, 3, 4, 4, 4, 5];
const BUBBLE_MS = 30000;

// Half width of the tiled aisle at height y (aisle edge ≈ x 420 at y 1300, x 240 at y 1640)
const aisleHalf = (y: number) => 120 + (y - 1300) * 0.56;
// How many people sit in each row: spread over the whole hall in proportion to each pew's capacity
// (largest-remainder rounding), so a half-empty church isn't crowded into the front pews.
const spreadOverRows = (n: number, caps: number[]) => {
  const total = caps.reduce((a, b) => a + b, 0);
  if (n >= total) return caps;
  const raw = caps.map((c) => (c * n) / total);
  const counts = raw.map(Math.floor);
  let left = n - counts.reduce((a, b) => a + b, 0);
  raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ i }) => {
      if (left > 0) {
        counts[i]++;
        left--;
      }
    });
  return counts;
};

const pctX = (x: number) => `${(x / BG_W) * 100}%`;
const pctY = (y: number) => `${(y / BG_H) * 100}%`;

interface ChurchSeatingProps {
  devotees: Devotee[];
}

/**
 * Seats churchgoers on the background's pews, front rows first, alternating left/right of the aisle.
 * A slice of pew backrest is drawn in front of each person so they look seated behind it.
 */
export const ChurchSeating: React.FC<ChurchSeatingProps> = ({ devotees }) => {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const sides: { side: 1 | -1; people: Devotee[] }[] = [
    { side: -1, people: devotees.filter((_, i) => i % 2 === 0) },
    { side: 1, people: devotees.filter((_, i) => i % 2 !== 0) },
  ];

  const baseTotal = BASE_CAPACITY.reduce((a, b) => a + b, 0);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sides.map(({ side, people }) => {
        // Squeeze more people per pew when the hall is fuller than its normal capacity
        const factor = Math.max(1, people.length / baseTotal);
        const caps = BASE_CAPACITY.map((c) => Math.ceil(c * factor));
        const counts = spreadOverRows(people.length, caps);

        const seats: React.ReactNode[] = [];
        let idx = 0;
        PEW_TOPS.forEach((top, r) => {
          const s = (top - VP_Y) / (BG_H - VP_Y); // perspective scale of this row
          const backH = 0.14 * (top - VP_Y);
          const y = top + backH; // seat line
          const inner = CX + side * (aisleHalf(top) + 8 * s);
          const outer = side < 0 ? 6 : BG_W - 6; // pews run off the edge of the photo
          const margin = 10 * s;
          const span = Math.abs(outer - inner) - 2 * margin;
          const cap = caps[r];
          const count = counts[r];
          const figW = 190 * s;
          const spacing = span / cap;

          for (let k = 0; k < count && idx < people.length; k++, idx++) {
            const d = people[idx];
            // Spread the row's people over the pew's seats, shifted a little per row so a sparse
            // hall doesn't form neat columns
            const shift = (r % 3) / 3;
            const slot = Math.min(cap - 1, Math.floor(((k + shift) * cap) / count));
            const x = inner + side * (margin + (slot + 0.5) * spacing);
            const z = 10 + r * 3;
            const recent = now - d.timestamp < BUBBLE_MS;
            const plateScale = Math.max(0.55, s * 1.05);

            seats.push(
              <React.Fragment key={d.id}>
                {/* Person (lower body hidden by the backrest drawn next) */}
                <div
                  className="absolute"
                  style={{
                    left: pctX(x),
                    // Head and shoulders show above the backrest (~45% of the figure is hidden behind it)
                    top: pctY(y - backH + figW * 0.45),
                    width: pctX(figW),
                    transform: 'translate(-50%, -100%)',
                    zIndex: z,
                  }}
                >
                  <ChurchgoerFigure
                    nickname={d.nickname}
                    prayer={d.prayer}
                    showPrayer={Boolean(d.prayer && d.incenseLit && recent)}
                  />
                </div>
                {/* Pew backrest slice in front of the person */}
                <div
                  className="absolute rounded-t-[2px]"
                  style={{
                    left: pctX(x - figW * 0.5),
                    top: pctY(y - backH),
                    width: pctX(figW),
                    height: pctY(backH),
                    // Matches the warm orange-brown pews of the background photo
                    background: 'linear-gradient(to bottom, #b77a45 0%, #8a5229 10%, #7a4724 11%, #4f2c14 100%)',
                    zIndex: z + 1,
                  }}
                />
                {/* Name plate on the pew */}
                <div
                  className="absolute inline-flex items-center gap-1 bg-[#120a06e6] border border-amber-400/60 rounded-full py-0.5 px-1.5 shadow-md max-w-[80px]"
                  style={{
                    left: pctX(x),
                    top: pctY(y - backH * 0.5),
                    transform: `translate(-50%, -50%) scale(${plateScale})`,
                    zIndex: z + 2,
                  }}
                >
                  <img
                    src={d.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(d.nickname)}`}
                    alt={d.nickname}
                    className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/70 shrink-0"
                  />
                  <span className="text-[7.5px] font-bold text-amber-100 truncate leading-none">{d.nickname}</span>
                </div>
              </React.Fragment>
            );
          }
        });
        return <React.Fragment key={side}>{seats}</React.Fragment>;
      })}
    </div>
  );
};
