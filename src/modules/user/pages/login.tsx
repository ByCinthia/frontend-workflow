import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useUser } from "../context";
import styles from "../styles/login.module.css";

// Validaciones básicas (puedes cambiarlas por email real)
function validateUsername(v: string) {
  return v.trim().length >= 3 ? { ok: true as const } : { ok: false as const, msg: "Mínimo 3 caracteres" };
}
function validatePassword(v: string) {
  return v.trim().length >= 6 ? { ok: true as const } : { ok: false as const, msg: "Mínimo 6 caracteres" };
}

export default function Login() {
  const { login } = useUser();

  // ---- estado del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // ---- errores y UI
  const [userErr, setUserErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  // animación de entrada de la card
  useEffect(() => {
    const card = formRef.current?.closest(`.${styles.card}`) as HTMLElement | null;
    if (!card) return;
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    requestAnimationFrame(() => {
      card.style.transition = "opacity .35s ease, transform .35s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  }, []);

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.trim().length >= 6 && !loading,
    [username, password, loading]
  );

  function handleForgot(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setToast("Te enviaremos un enlace para restablecer tu contraseña (demo).");
    setTimeout(() => setToast(null), 2200);
  }

  function handleFocusWrap(e: React.FocusEvent<HTMLInputElement>) {
    const w = e.currentTarget.closest(`.${styles.field}`) as HTMLElement | null;
    w?.classList.add("focused");
  }
  function handleBlurWrap(e: React.FocusEvent<HTMLInputElement>) {
    const w = e.currentTarget.closest(`.${styles.field}`) as HTMLElement | null;
    w?.classList.remove("focused");
  }

  function validateFields(): boolean {
    const vU = validateUsername(username);
    const vP = validatePassword(password);
    setUserErr(vU.ok ? null : vU.msg!);
    setPassErr(vP.ok ? null : vP.msg!);
    return vU.ok && vP.ok;
  }

  function shakeCard() {
    const card = formRef.current?.closest(`.${styles.card}`) as HTMLElement | null;
    if (!card) return;
    card.style.animation = "shake .45s ease-in-out";
    setTimeout(() => (card.style.animation = ""), 450);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setToast(null);

    if (!validateFields()) {
      shakeCard();
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      if (remember) localStorage.setItem("remember", "1");
      else localStorage.removeItem("remember");
    } catch {
      setToast("Credenciales inválidas");
      shakeCard();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form ref={formRef} onSubmit={onSubmit}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Access your account</p>

          {/* Usuario */}
          <label className={styles.field}>
            <span className={styles.icon}>📧</span>
            <input
              className={styles.input}
              placeholder="Email o usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (userErr) setUserErr(null);
              }}
              onFocus={handleFocusWrap}
              onBlur={(e) => {
                handleBlurWrap(e);
                const v = validateUsername(e.currentTarget.value);
                setUserErr(v.ok ? null : v.msg!);
              }}
              required
            />
          </label>
          {userErr && (
            <div style={{ color: "crimson", fontSize: 12, marginTop: -8, marginBottom: 8 }}>{userErr}</div>
          )}

          {/* Password */}
          <label className={styles.field}>
            <span className={styles.icon}>🔒</span>
            <input
              className={styles.input}
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passErr) setPassErr(null);
              }}
              onFocus={handleFocusWrap}
              onBlur={(e) => {
                handleBlurWrap(e);
                const v = validatePassword(e.currentTarget.value);
                setPassErr(v.ok ? null : v.msg!);
              }}
              required
            />
            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPw((s) => !s)}
              aria-label="toggle password"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </label>
          {passErr && (
            <div style={{ color: "crimson", fontSize: 12, marginTop: -8, marginBottom: 8 }}>{passErr}</div>
          )}

          {/* Remember + forgot */}
          <div className={styles.actions}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={remember} onChange={() => setRemember((r) => !r)} /> Keep me signed in
            </label>
            <a className={styles.link} href="#" onClick={handleForgot}>
              Forgot password?
            </a>
          </div>

          <button className={styles.button} disabled={!canSubmit}>
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        {toast && (
          <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, color: "#d1d5db" }}>{toast}</div>
        )}
      </div>

      {/* keyframes locales por si no están en global */}
      <style>
        {`@keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(4px); }
            30%, 50%, 70% { transform: translateX(-6px); }
            40%, 60% { transform: translateX(6px); }
          }`}

      </style>
    </div>
  );
}
