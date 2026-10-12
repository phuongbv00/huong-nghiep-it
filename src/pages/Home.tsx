import { Link } from 'react-router-dom';
import AiImpactBadge from '../components/AiImpactBadge';
import { CHAPTERS, QUESTIONS } from '../data/questions';
import { AI_IMPACT, ROLES, type AiImpactLevel } from '../data/roles';
import { hasQuizInProgress, loadLastResult } from '../lib/quizState';
import { trackingEnabled } from '../lib/tracking';

const AUDIENCES = [
  { emoji: '🎓', title: 'Sinh viên IT', text: 'Chưa biết nên chọn chuyên ngành, đi thực tập hướng nào giữa hàng chục vai trò.' },
  { emoji: '🧑‍💻', title: 'Intern / Fresher', text: 'Đã đi làm nhưng chưa chắc mình hợp — muốn biết nên đào sâu hay đổi hướng.' },
  { emoji: '🔄', title: 'Người trái ngành', text: 'Muốn vào IT nhưng không biết bắt đầu từ đâu, và ngành cũ của mình là lợi thế ở đâu.' },
];

const chapterMinutes = (id: number) =>
  Math.max(1, Math.round(QUESTIONS.filter((q) => q.chapter === id).reduce((s, q) => s + q.seconds, 0) / 60));

function DemoCard() {
  const q = QUESTIONS.find((x) => x.id === 's3');
  if (!q || q.kind !== 'scenario') return null;
  return (
    <div className="card relative rotate-1 p-5 shadow-xl shadow-brand-900/5 sm:p-6" aria-hidden>
      <div className="flex gap-1.5">
        {[1, 1, 0.4, 0, 0].map((f, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-brand-600" style={{ width: `${f * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-xl dark:bg-brand-950">{q.emoji}</span>
        <span className="eyebrow">{q.day}</span>
      </div>
      <p className="mt-3 text-lg font-bold leading-snug">{q.prompt}</p>
      <div className="mt-4 space-y-2">
        {q.options.map((o, i) => (
          <div key={o.id} className={`flex gap-2.5 rounded-xl border-2 px-3 py-2.5 text-sm font-medium ${i === 1 ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60' : 'border-slate-200 dark:border-slate-800'}`}>
            <span>{o.emoji}</span>
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const resume = hasQuizInProgress();
  const last = loadLastResult();
  const byImpact = (level: AiImpactLevel) => ROLES.filter((r) => r.aiImpact.level === level);

  return (
    <>
      <section className="container-page grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <span className="eyebrow">Trắc nghiệm hướng nghiệp IT · 2026</span>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            AI đang thay đổi ngành IT.
            <span className="block text-brand-600 dark:text-brand-400">Vai trò nào dành cho bạn?</span>
          </h1>
          <p className="muted mt-5 max-w-xl text-lg">
            Trả lời các tình huống của <b className="text-slate-900 dark:text-white">một tuần ở công ty công nghệ</b> — không cần biết gì về lập trình. Nhận top 3 vai trò hợp với bạn, mức độ AI tác động và lộ trình cụ thể.
          </p>

          {resume && (
            <Link to="/trac-nghiem" className="mt-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-brand-200 bg-brand-50 p-4 font-semibold text-brand-900 hover:border-brand-400 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-100">
              <span>⏯️ Bạn có bài đang làm dở — tiếp tục nhé?</span>
              <span aria-hidden>→</span>
            </Link>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={resume ? '/trac-nghiem?moi=1' : '/trac-nghiem'} className={resume ? 'btn-secondary' : 'btn-primary px-7 text-lg'}>
              {resume ? 'Làm lại từ đầu' : 'Bắt đầu ngay →'}
            </Link>
            {last && (
              <Link to="/ket-qua" className="btn-ghost">
                Xem kết quả gần nhất
              </Link>
            )}
          </div>
          <ul className="muted mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <li>⏱️ Kết quả sơ bộ sau ~3 phút</li>
            <li>👆 1 chạm mỗi câu</li>
            <li>🔓 Không cần đăng ký</li>
          </ul>
          {trackingEnabled() && (
            <p className="muted mt-3 text-xs">
              Câu trả lời được lưu <b>ẩn danh</b> để cải thiện công cụ ·{' '}
              <Link to="/quyen-rieng-tu" className="underline">
                Tìm hiểu thêm
              </Link>
            </p>
          )}
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <DemoCard />
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Dành cho ai?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="card p-5">
              <span className="text-3xl" aria-hidden>
                {a.emoji}
              </span>
              <h3 className="mt-3 text-lg font-bold">{a.title}</h3>
              <p className="muted mt-1">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Cách hoạt động</h2>
        <p className="muted mt-2">2 chương bắt buộc, sau đó bạn tự chọn xem kết quả luôn hay làm thêm để chính xác hơn.</p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CHAPTERS.map((c) => (
            <li key={c.id} className="card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Chương {c.id} · ~{chapterMinutes(c.id)} phút
              </p>
              <p className="mt-1 font-bold">{c.title}</p>
              <p className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${c.optional ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'}`}>
                {c.optional ? 'Tuỳ chọn' : 'Bắt buộc'}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page py-10">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">AI đang tác động tới từng vai trò thế nào?</h2>
        <p className="muted mt-2 max-w-2xl">Không phải vai trò nào cũng bị AI "thay thế". Có vai trò được AI tăng sức, có vai trò đang thay đổi, và có vai trò mới sinh ra.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {(Object.keys(AI_IMPACT) as AiImpactLevel[]).map((level) => (
            <div key={level} className="card p-5">
              <AiImpactBadge level={level} long />
              <ul className="mt-4 flex flex-wrap gap-2">
                {byImpact(level).map((r) => (
                  <li key={r.id}>
                    <Link to={`/vai-tro/${r.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-medium hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-950 dark:hover:text-brand-300">
                      {r.emoji} {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="rounded-3xl bg-brand-600 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Sẵn sàng tìm hướng đi của bạn?</h2>
          <p className="mx-auto mt-2 max-w-lg text-brand-100">Chỉ cần chọn việc bạn muốn làm trong mỗi tình huống. Không có đáp án đúng hay sai.</p>
          <Link to="/trac-nghiem" className="btn mt-6 bg-white px-7 text-lg text-brand-700 hover:bg-brand-50">
            {resume ? 'Tiếp tục bài đang làm →' : 'Bắt đầu trắc nghiệm →'}
          </Link>
        </div>
      </section>
    </>
  );
}
