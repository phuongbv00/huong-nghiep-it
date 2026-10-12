import { dimByKey } from '../data/dimensions';
import type { ScoreResult } from '../lib/scoring';
import { useKeys } from '../lib/useKeys';

interface Props {
  result: ScoreResult;
  extraMinutes: number;
  onContinue: () => void;
  onFinish: () => void;
}

export default function PreviewCheckpoint({ result, extraMinutes, onContinue, onFinish }: Props) {
  useKeys((e) => {
    if (e.key === 'Enter') onContinue();
  });
  const top = result.ranking.slice(0, 3);
  const confidence =
    result.insufficient
      ? { icon: '🤔', text: 'Bạn chọn "Không cái nào" khá nhiều nên mình chưa đủ dữ liệu. Làm thêm phần sau sẽ giúp rất nhiều!' }
      : result.confidence === 'clear'
        ? { icon: '🎯', text: 'Xu hướng của bạn khá rõ rồi.' }
        : { icon: '⚖️', text: `Bạn đang phân vân giữa ${top[0].role.name} và ${top[1].role.name}. Làm thêm ${extraMinutes} phút để phân định rõ hơn.` };

  return (
    <div className="animate-fade-up">
      <div className="text-center">
        <span className="text-4xl" aria-hidden>
          🎉
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Kết quả sơ bộ</h1>
        {result.topDims.length > 0 && (
          <p className="muted mt-2">
            Thế mạnh nổi bật: {result.topDims.slice(0, 2).map((k) => `${dimByKey[k].emoji} ${dimByKey[k].short}`).join(' · ')}
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-2.5">
        {top.map((m, i) => (
          <li key={m.role.id} className="card flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-2xl dark:bg-slate-800" aria-hidden>
              {m.role.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">
                <span className="text-slate-400">#{i + 1}</span> {m.role.name}
              </p>
              <p className="muted truncate text-sm">{m.role.plain}</p>
            </div>
            <span className="text-lg font-extrabold text-brand-700 dark:text-brand-300">{m.percent}%</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-900">
        <span aria-hidden>{confidence.icon}</span>
        {confidence.text}
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <button type="button" className="btn-primary w-full" onClick={onContinue} autoFocus>
          Làm thêm {extraMinutes} phút để chính xác hơn →
        </button>
        <button type="button" className="btn-secondary w-full" onClick={onFinish}>
          Xem kết quả chi tiết ngay
        </button>
      </div>
      <p className="muted mt-3 text-center text-xs">Phần tiếp theo: chọn nhanh, thử tay 30 giây và 1 câu về ưu tiên.</p>
    </div>
  );
}
