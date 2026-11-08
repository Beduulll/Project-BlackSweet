import { useState } from "react";
import type { FormEvent } from "react";
import { getSecurityQuestion, login, register, resetPassword } from "../api/auth.api";
import type { AuthUser } from "../types/auth";
import { getErrorMessage } from "../utils/error";

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama Anda?",
  "Nama sekolah dasar Anda?",
  "Di kota mana ibu Anda dilahirkan?",
  "Siapa nama panggilan Anda semasa kecil?",
];

type Mode = "login" | "register" | "forgot";

interface AuthPageProps {
  onLogin: (token: string, user: AuthUser) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [answer, setAnswer] = useState("");

  const [resetQuestion, setResetQuestion] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setPassword("");
    setConfirm("");
    setAnswer("");
    setResetQuestion(null);
  };

  const run = async (task: () => Promise<void>) => {
    setError(null);
    setNotice(null);
    try {
      setLoading(true);
      await task();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }
    run(async () => {
      const result = await login(username.trim(), password);
      onLogin(result.token, result.user);
    });
  };

  const submitRegister = (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !username.trim() || !password || !answer.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Pengulangan password tidak sama.");
      return;
    }
    run(async () => {
      const result = await register({
        full_name: fullName.trim(),
        username: username.trim(),
        password,
        security_question: question,
        security_answer: answer,
      });
      onLogin(result.token, result.user);
    });
  };

  const submitForgot = (event: FormEvent) => {
    event.preventDefault();

    if (resetQuestion === null) {
      if (!username.trim()) {
        setError("Masukkan username Anda.");
        return;
      }
      run(async () => setResetQuestion(await getSecurityQuestion(username.trim())));
      return;
    }

    if (!answer.trim() || !password) {
      setError("Jawaban dan password baru wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Pengulangan password tidak sama.");
      return;
    }
    run(async () => {
      await resetPassword(username.trim(), answer, password);
      const done = username.trim();
      switchMode("login");
      setUsername(done);
      setNotice("Password berhasil diganti. Silakan masuk.");
    });
  };

  const title = { login: "Masuk", register: "Buat akun", forgot: "Lupa password" }[mode];

  return (
    <div className="auth">
      <div className="auth__intro">
        <span className="brand-mark brand-mark--lg" aria-hidden="true">L</span>
        <h1>LaundryBlackSweet</h1>
        <p>Catat pesanan, pelanggan, dan pendapatan laundry Anda dalam satu tempat.</p>
      </div>

      <div className="auth__panel">
        <h2 className="auth__title">{title}</h2>

        {mode === "login" && (
          <form className="form" onSubmit={submitLogin}>
            <div className="field">
              <label htmlFor="a-user">Username</label>
              <input
                id="a-user"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="a-pass">Password</label>
              <input
                id="a-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {notice && <p className="form-notice">{notice}</p>}
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
            <div className="auth__links">
              <button type="button" className="link-btn" onClick={() => switchMode("forgot")}>
                Lupa password?
              </button>
              <button type="button" className="link-btn" onClick={() => switchMode("register")}>
                Buat akun
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form className="form" onSubmit={submitRegister}>
            <div className="field">
              <label htmlFor="r-name">Nama lengkap</label>
              <input
                id="r-name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="r-user">Username</label>
              <input
                id="r-user"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="r-pass">Password</label>
                <input
                  id="r-pass"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="r-confirm">Ulangi password</label>
                <input
                  id="r-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="r-question">Pertanyaan keamanan</label>
              <select id="r-question" value={question} onChange={(e) => setQuestion(e.target.value)}>
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
              <span className="field__hint">Dipakai untuk mengatur ulang password bila Anda lupa.</span>
            </div>
            <div className="field">
              <label htmlFor="r-answer">Jawaban</label>
              <input id="r-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? "Menyimpan..." : "Buat akun"}
            </button>
            <div className="auth__links">
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Sudah punya akun? Masuk
              </button>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form className="form" onSubmit={submitForgot}>
            <div className="field">
              <label htmlFor="f-user">Username</label>
              <input
                id="f-user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={resetQuestion !== null}
                autoFocus
              />
            </div>

            {resetQuestion !== null && (
              <>
                <div className="field">
                  <label htmlFor="f-answer">{resetQuestion}</label>
                  <input
                    id="f-answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-pass">Password baru</label>
                    <input
                      id="f-pass"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="f-confirm">Ulangi password</label>
                    <input
                      id="f-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? "Memproses..." : resetQuestion === null ? "Lanjut" : "Ganti password"}
            </button>
            <div className="auth__links">
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Kembali ke halaman masuk
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
