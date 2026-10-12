import { SKIP, type ChallengeQuestion } from '../data/questions';
import { useKeys } from '../lib/useKeys';
import OptionButton from './OptionButton';

interface Props {
  q: ChallengeQuestion;
  value: string | undefined;
  onAnswer: (v: string) => void;
  onNext: () => void;
  locked: boolean;
}

function FormMock({ variant }: { variant: 'a' | 'b' }) {
  if (variant === 'a') {
    const fields = ['Họ*', 'Tên đệm*', 'Tên*', 'Ngày sinh*', 'Giới tính*', 'Số CCCD*', 'Địa chỉ*', 'Nghề nghiệp*', 'Email*'];
    return (
      <div className="w-full space-y-1 text-left" aria-hidden>
        <div className="mb-1.5 text-[11px] font-bold text-slate-500">ĐĂNG KÝ TÀI KHOẢN</div>
        <div className="grid grid-cols-3 gap-1">
          {fields.map((f) => (
            <div key={f} className="truncate rounded border border-slate-300 px-1 py-1 text-[9px] text-slate-400 dark:border-slate-700">
              {f}
            </div>
          ))}
        </div>
        <div className="mt-1.5 rounded bg-slate-200 py-1 text-center text-[10px] text-slate-400 dark:bg-slate-800">gửi</div>
      </div>
    );
  }
  return (
    <div className="w-full space-y-2 text-left" aria-hidden>
      <div className="text-[13px] font-bold">Tạo tài khoản</div>
      {['Email', 'Mật khẩu'].map((f) => (
        <div key={f}>
          <div className="mb-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">{f}</div>
          <div className="h-6 rounded-md border border-slate-300 dark:border-slate-700" />
        </div>
      ))}
      <div className="rounded-md bg-brand-600 py-1.5 text-center text-[11px] font-bold text-white">Tạo tài khoản</div>
    </div>
  );
}

function ChartMock() {
  // Trục tung bắt đầu từ 900: 950 → 1.050 trông như tăng gấp 3.
  const y = (v: number) => 150 - ((v - 900) / 160) * 130;
  return (
    <figure className="card mx-auto max-w-sm p-4" aria-label="Biểu đồ cột: tháng 1 doanh thu 950, tháng 2 doanh thu 1.050, trục tung bắt đầu từ 900">
      <figcaption className="text-center text-sm font-bold">Doanh thu tăng gấp 3! 🚀</figcaption>
      <svg viewBox="0 0 240 170" className="mt-2 w-full" aria-hidden>
        <line x1="40" y1="20" x2="40" y2="150" className="stroke-slate-400" />
        <line x1="40" y1="150" x2="230" y2="150" className="stroke-slate-400" />
        {[900, 950, 1000, 1050].map((t) => (
          <g key={t}>
            <text x="34" y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[10px]">
              {t.toLocaleString('vi-VN')}
            </text>
            <line x1="38" x2="230" y1={y(t)} y2={y(t)} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="2 3" />
          </g>
        ))}
        <rect x="70" y={y(950)} width="50" height={150 - y(950)} rx="3" className="fill-slate-400" />
        <rect x="150" y={y(1050)} width="50" height={150 - y(1050)} rx="3" className="fill-brand-500" />
        <text x="95" y="163" textAnchor="middle" className="fill-slate-500 text-[10px]">Tháng 1</text>
        <text x="175" y="163" textAnchor="middle" className="fill-slate-500 text-[10px]">Tháng 2</text>
      </svg>
    </figure>
  );
}

function CodeMock() {
  return (
    <pre className="mx-auto max-w-sm overflow-x-auto rounded-2xl bg-slate-900 p-5 font-mono text-[15px] leading-7 text-slate-100 dark:bg-black">
      <code>
        <span className="text-sky-300">x</span> ← 1{'\n'}
        <span className="text-pink-300">lặp lại 3 lần:</span>{'\n'}
        {'    '}
        <span className="text-sky-300">x</span> ← <span className="text-sky-300">x</span> × 2{'\n'}
        <span className="text-pink-300">in ra</span> <span className="text-sky-300">x</span>
      </code>
    </pre>
  );
}

export default function QuestionChallenge({ q, value, onAnswer, onNext, locked }: Props) {
  const answered = value !== undefined && value !== SKIP;
  const correct = value === q.correct;

  useKeys((e) => {
    if (answered) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
      return;
    }
    const n = Number(e.key);
    if (n >= 1 && n <= q.options.length) onAnswer(q.options[n - 1].id);
  }, !locked);

  const optionClass = (id: string) => {
    if (!answered) return '';
    if (id === q.correct) return '!border-emerald-500 !bg-emerald-50 dark:!bg-emerald-950/50';
    if (id === value) return '!border-rose-400 !bg-rose-50 dark:!bg-rose-950/40';
    return 'opacity-60';
  };

  return (
    <div className="animate-fade-up" key={q.id}>
      <span className="eyebrow">⏱️ Thử thách · {q.title}</span>
      <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-[28px]">{q.prompt}</h1>

      {q.visual === 'form' ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {q.options.map((o, i) => (
            <button
              key={o.id}
              type="button"
              disabled={answered || locked}
              aria-pressed={value === o.id}
              aria-label={o.label}
              onClick={() => onAnswer(o.id)}
              className={`option-card flex-col items-stretch gap-3 p-3 ${optionClass(o.id)}`}
            >
              <div className="flex items-center justify-between text-sm font-bold">
                {o.label} <span className="kbd">{i + 1}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                <FormMock variant={o.id as 'a' | 'b'} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6">{q.visual === 'chart' ? <ChartMock /> : <CodeMock />}</div>
          <div className={`mt-5 grid gap-2.5 ${q.visual === 'code' ? 'grid-cols-4' : ''}`}>
            {q.options.map((o, i) => (
              <OptionButton
                key={o.id}
                index={q.visual === 'code' ? undefined : i}
                selected={value === o.id}
                disabled={answered || locked}
                onClick={() => onAnswer(o.id)}
                className={`${q.visual === 'code' ? 'justify-center text-center text-xl font-bold' : ''} ${optionClass(o.id)}`}
              >
                {o.label}
              </OptionButton>
            ))}
          </div>
        </>
      )}

      {answered ? (
        <div
          role="status"
          className={`mt-5 animate-fade-up rounded-2xl p-4 ${
            correct ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100'
          }`}
        >
          <p className="font-bold">{correct ? '🎉 Chính xác!' : '🙂 Chưa đúng — không sao cả!'}</p>
          <p className="mt-1 text-[15px]">{q.explain}</p>
          <button type="button" className="btn-primary mt-4 w-full sm:w-auto" onClick={onNext} autoFocus>
            Tiếp tục →
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <button type="button" disabled={locked} onClick={() => onAnswer(SKIP)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 underline-offset-4 hover:underline dark:text-slate-400">
            Bỏ qua câu này
          </button>
        </div>
      )}
    </div>
  );
}
