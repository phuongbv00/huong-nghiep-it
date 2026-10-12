import { DIMENSIONS, type DimKey } from '../data/dimensions';

const SIZE = 300;
const C = SIZE / 2;
const R = 122;

function point(i: number, n: number, value: number) {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  return [C + Math.cos(angle) * R * value, C + Math.sin(angle) * R * value] as const;
}

export default function RadarChart({ profile }: { profile: Record<DimKey, number> }) {
  const n = DIMENSIONS.length;
  const poly = DIMENSIONS.map((d, i) => point(i, n, Math.max(0.04, profile[d.key] / 100)).join(',')).join(' ');
  return (
    <svg
      viewBox={`-90 -26 ${SIZE + 180} ${SIZE + 52}`}
      className="mx-auto w-full max-w-[420px]"
      role="img"
      aria-label={`Hồ sơ của bạn: ${DIMENSIONS.map((d) => `${d.label} ${profile[d.key]}`).join(', ')}`}
    >
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={DIMENSIONS.map((_, i) => point(i, n, r).join(',')).join(' ')}
          className="fill-none stroke-slate-200 dark:stroke-slate-800"
          strokeWidth={1}
        />
      ))}
      {DIMENSIONS.map((_, i) => {
        const [x, y] = point(i, n, 1);
        return <line key={i} x1={C} y1={C} x2={x} y2={y} className="stroke-slate-200 dark:stroke-slate-800" />;
      })}
      <polygon points={poly} className="fill-brand-500/25 stroke-brand-600 dark:stroke-brand-400" strokeWidth={2.5} strokeLinejoin="round" />
      {DIMENSIONS.map((d, i) => {
        const [x, y] = point(i, n, Math.max(0.04, profile[d.key] / 100));
        return <circle key={d.key} cx={x} cy={y} r={3.5} className="fill-brand-600 dark:fill-brand-400" />;
      })}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = point(i, n, 1.2);
        const anchor = Math.abs(x - C) < 8 ? 'middle' : x > C ? 'start' : 'end';
        return (
          <text key={d.key} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className="fill-slate-700 text-[13px] font-semibold dark:fill-slate-300">
            <tspan>{d.emoji} {d.short}</tspan>
            <tspan x={x} dy={15} className="fill-slate-400 text-[11px] font-medium">
              {profile[d.key]}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
