import { Link, NavLink, Outlet } from 'react-router-dom';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  }`;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow-sm">🧭</span>
      <span className="whitespace-nowrap leading-tight">
        Hướng nghiệp IT
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          thời AI
        </span>
      </span>
    </Link>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/85 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/85">
        <div className="container-page flex h-16 items-center justify-between gap-2">
          <Logo />
          <nav className="flex items-center gap-1">
            <NavLink to="/vai-tro" className={navClass}>
              Vai trò
            </NavLink>
            <Link to="/trac-nghiem" className="btn-primary min-h-[40px] whitespace-nowrap px-3.5 py-2 text-sm sm:px-4">
              <span className="sm:hidden">Bắt đầu</span>
              <span className="hidden sm:inline">Làm trắc nghiệm</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-8 text-sm dark:border-slate-800">
        <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="muted">
            Công cụ tham khảo miễn phí. Mức lương là ước lượng thị trường Việt Nam, dao động lớn theo công ty.
          </p>
          <Link to="/quyen-rieng-tu" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Quyền riêng tư
          </Link>
        </div>
      </footer>
    </div>
  );
}
