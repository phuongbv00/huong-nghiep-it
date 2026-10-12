import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KEYS, load, save } from '../lib/storage';
import { tracker } from '../lib/tracking';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailCapture({ attemptId }: { attemptId: string }) {
  const [sent, setSent] = useState(() => load<string>(KEYS.emailSent) === attemptId);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');
  const [error, setError] = useState('');

  if (sent) {
    return (
      <div className="card p-5 text-center">
        <p className="font-semibold">📬 Đã lưu email của bạn. Hẹn gặp lại!</p>
      </div>
    );
  }

  return (
    <form
      className="card p-5"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL_RE.test(email.trim())) return setError('Email chưa đúng định dạng.');
        if (!consent) return setError('Bạn cần đồng ý để mình lưu email.');
        tracker.email(email, consent, hp);
        save(KEYS.emailSent, attemptId);
        setSent(true);
      }}
    >
      <h2 className="text-lg font-bold">Nhận thông báo khi có lộ trình chi tiết & tài nguyên mới</h2>
      <p className="muted mt-1 text-sm">Không bắt buộc. Không spam, không chia sẻ cho bên thứ ba.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ban@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="min-h-[48px] flex-1 rounded-xl border border-slate-300 bg-white px-4 dark:border-slate-700 dark:bg-slate-900"
        />
        <button type="submit" className="btn-primary">
          Đăng ký
        </button>
      </div>
      {/* Ô bẫy chống bot: người dùng thật không nhìn thấy. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden />
      <label className="mt-3 flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setError('');
          }}
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
        />
        <span>
          Tôi đồng ý cho lưu email để nhận cập nhật (xem{' '}
          <Link to="/quyen-rieng-tu" className="font-semibold text-brand-700 underline dark:text-brand-300">
            quyền riêng tư
          </Link>
          ).
        </span>
      </label>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
    </form>
  );
}
