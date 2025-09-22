import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { api, setTokens } from "../././api"; // <-- ruta correcta

function validateUsername(v: string) {
  return v.trim().length >= 3 ? { ok: true as const } : { ok: false as const, msg: "Mínimo 3 caracteres" };
}
function validatePassword(v: string) {
  return v.trim().length >= 6 ? { ok: true as const } : { ok: false as const, msg: "Mínimo 6 caracteres" };
}

export default function Login() {
  const navigate = useNavigate();
  console.log("BASE:", import.meta.env.VITE_API_URL, api.defaults.baseURL);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [userErr, setUserErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  
  useEffect(() => {
    const card = formRef.current?.closest(`.${styles.card}`) as HTMLElement | null;
    if (!card) return;
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    requestAnimationFrame(() => {
      card.style.transition = "all 0.3s ease";
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
    e.currentTarget.closest(`.${styles.field}`)?.classList.add("focused");
  }
  function handleBlurWrap(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.closest(`.${styles.field}`)?.classList.remove("focused");
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
      const { data } = await api.post("/api/token/", { username, password });
      setTokens(data.access, data.refresh);
      if (remember) localStorage.setItem("remember", "1");
      else localStorage.removeItem("remember");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Credenciales inválidas";
      setToast(msg);
      shakeCard();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form ref={formRef} onSubmit={onSubmit}>
          <h1 className={styles.title}>Bienvenido</h1>
          <p className={styles.subtitle}>Accede a tu cuenta</p>

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
              aria-label="Email o usuario"
            />
          </label>
          {userErr && <div className={styles.error} role="alert">{userErr}</div>}

          <label className={styles.field}>
            <span className={styles.icon}>🔒</span>
            <input
              className={styles.input}
              type={showPw ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passErr) setPassErr(null);
              }}
              onFocus={handleFocusWrap}
              onBlur={(e) => {
                handleBlurWrap(e);
                const v = validatePassword(e.target.value);
                setPassErr(v.ok ? null : v.msg!);
              }}
              required
              aria-label="Contraseña"
            />
            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPw ? "ocultar" : "ver"}
            </button>
          </label>
          {passErr && <div className={styles.error} role="alert">{passErr}</div>}

          <div className={styles.actions}>
            <label className={styles.remember}>
              <input type="checkbox" checked={remember} onChange={() => setRemember((r) => !r)} />
              <span>Mantenerme conectado</span>
            </label>
            <a className={styles.link} href="#" onClick={handleForgot}>¿Olvidaste tu contraseña?</a>
          </div>

          <button className={styles.button} disabled={!canSubmit} type="submit">
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className={styles.registerSection}>
            <p>¿No tienes cuenta? <Link to="/register" className={styles.registerLink}>Registrarse</Link></p>
          </div>
        </form>

        {toast && <div className={styles.toast} role="alert">{toast}</div>}
      </div>
    </div>
  );
}
