import type { ReactNode } from "react";
import type { AuthUser } from "../types/auth";

export type PageKey = "dashboard" | "orders" | "customers" | "services";

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

export const PAGES: { key: PageKey; label: string; icon: ReactNode }[] = [
  {
    key: "dashboard",
    label: "Beranda",
    icon: icon(<path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" />),
  },
  {
    key: "orders",
    label: "Pesanan",
    icon: icon(
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
      </>
    ),
  },
  {
    key: "customers",
    label: "Pelanggan",
    icon: icon(
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c2 .8 3.5 2.6 3.5 5.6" />
      </>
    ),
  },
  {
    key: "services",
    label: "Layanan",
    icon: icon(
      <>
        <path d="M3 12.2V4h8.2l9.8 9.8-8.2 8.2z" />
        <circle cx="7.5" cy="8.5" r="1.2" />
      </>
    ),
  },
];

interface NavbarProps {
  current: PageKey;
  user: AuthUser;
  onChange: (page: PageKey) => void;
  onLogout: () => void;
}

export default function Navbar({ current, user, onChange, onLogout }: NavbarProps) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <button type="button" className="nav__brand" onClick={() => onChange("dashboard")}>
          <span className="brand-mark" aria-hidden="true">L</span>
          <span className="nav__brand-name">LaundryBlackSweet</span>
        </button>

        <nav className="nav__links" aria-label="Navigasi utama">
          {PAGES.map((page) => (
            <button
              key={page.key}
              type="button"
              title={page.label}
              className={`nav__link ${current === page.key ? "is-active" : ""}`}
              aria-current={current === page.key ? "page" : undefined}
              onClick={() => onChange(page.key)}
            >
              {page.icon}
              <span className="nav__label">{page.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav__user">
          <span className="avatar" aria-hidden="true">{user.full_name.charAt(0).toUpperCase()}</span>
          <span className="nav__user-name">{user.full_name}</span>
          <button type="button" className="btn btn--gray btn--sm" onClick={onLogout}>
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
