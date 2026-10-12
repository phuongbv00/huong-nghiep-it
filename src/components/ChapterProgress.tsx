import { CHAPTERS, type ChapterId } from '../data/questions';

interface Props {
  segments: { chapter: ChapterId; done: number; count: number }[];
  current: ChapterId;
  optionalLocked: boolean;
}

/** Thanh tiến độ chia đoạn theo chương; các chương tuỳ chọn hiện mờ khi chưa chọn làm tiếp. */
export default function ChapterProgress({ segments, current, optionalLocked }: Props) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {segments
        .filter((s) => s.count > 0)
        .map((s) => {
          const ch = CHAPTERS[s.chapter];
          const dim = optionalLocked && ch.optional;
          return (
            <div
              key={s.chapter}
              style={{ flexGrow: s.count }}
              className={`h-2 overflow-hidden rounded-full ${
                dim ? 'bg-slate-200/50 dark:bg-slate-800/50' : 'bg-slate-200 dark:bg-slate-800'
              } ${s.chapter === current ? 'ring-1 ring-brand-300 dark:ring-brand-700' : ''}`}
            >
              <div
                className="h-full rounded-full bg-brand-600 transition-[width] duration-500 dark:bg-brand-400"
                style={{ width: `${Math.round(s.done * 100)}%` }}
              />
            </div>
          );
        })}
    </div>
  );
}
