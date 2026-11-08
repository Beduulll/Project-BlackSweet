import { useCallback, useEffect, useState } from "react";
import Navbar, { PAGES } from "./components/Navbar";
import type { PageKey } from "./components/Navbar";
import ToastStack from "./components/Toast";
import type { Notify, ToastItem, ToastType } from "./components/Toast";
import { LoadingView } from "./components/StateViews";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import ServicesPage from "./pages/ServicesPage";
import AuthPage from "./pages/AuthPage";
import { getMe } from "./api/auth.api";
import { TOKEN_KEY } from "./api/axiosClient";
import type { AuthUser } from "./types/auth";

const readPageFromHash = (): PageKey => {
  const hash = window.location.hash.replace("#", "");
  return PAGES.some((page) => page.key === hash) ? (hash as PageKey) : "dashboard";
};

let toastId = 0;

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState<boolean>(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [page, setPage] = useState<PageKey>(readPageFromHash);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const closeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify: Notify = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => closeToast(id), 3500);
    },
    [closeToast]
  );

  const handleLogin = (token: string, loggedIn: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedIn);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const changePage = (next: PageKey) => {
    window.location.hash = next;
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  if (checking) return <LoadingView text="Memeriksa sesi..." />;
  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <>
      <Navbar current={page} user={user} onChange={changePage} onLogout={handleLogout} />

      <main className="main">
        {page === "dashboard" && <DashboardPage />}
        {page === "orders" && <OrdersPage notify={notify} />}
        {page === "customers" && <CustomersPage notify={notify} />}
        {page === "services" && <ServicesPage notify={notify} />}
      </main>

      <ToastStack toasts={toasts} onClose={closeToast} />
    </>
  );
}
