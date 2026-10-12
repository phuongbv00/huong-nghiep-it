import { dimByKey, type DimKey } from '../data/dimensions';
import { CHAPTERS, type ChapterId } from '../data/questions';
import { remainingLabel } from '../lib/flow';
import { useKeys } from '../lib/useKeys';

interface Props {
  chapter: ChapterId;
  seconds: number;
  leaning: DimKey[];
  onStart: () => void;
  onSkip?: () => void;
  skipLabel?: string;
}

export default function ChapterInterstitial({ chapter, seconds, leaning, onStart, onSkip, skipLabel }: Props) {
  const ch = CHAPTERS[chapter];
  useKeys((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStart();
    }
  });
  const mins = Math.max(1, Math.round(seconds / 60));
  return (
    <div className="animate-fade-up py-6 text-center sm:py-10" key={chapter}>
      <span className="eyebrow">Chương {chapter} · khoảng {mins} phút{ch.optional ? ' · tuỳ chọn' : ''}</span>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{ch.title}</h1>
      <p className="muted mx-auto mt-4 max-w-md text-lg">{ch.intro}</p>

      {leaning.length > 0 && (
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-4 dark:border-brand-800 dark:bg-brand-950/40">
          <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">Bạn đang nghiêng về</p>
          <p className="mt-1 text-lg font-bold">
            {leaning.map((k) => `${dimByKey[k].emoji} ${dimByKey[k].short}`).join(' · ')}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-2">
        <button type="button" className="btn-primary w-full max-w-xs" onClick={onStart} autoFocus>
          Bắt đầu →
        </button>
        {onSkip && (
          <button type="button" className="btn-ghost text-sm" onClick={onSkip}>
            {skipLabel ?? 'Bỏ qua phần này'}
          </button>
        )}
        <span className="muted mt-1 text-xs">{remainingLabel(seconds)} cho chương này</span>
      </div>
    </div>
  );
}
