import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../././api";
import styles from "../styles/register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phone: "",
    position: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (formData.password !== formData.confirmPassword) {
      setToast("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/register/", {
        username: formData.username,
        email: formData.username, // si tu backend espera email separado, cámbialo
        password: formData.password,
        company_name: formData.companyName,
        phone: formData.phone,
        position: formData.position,
        address: formData.address,
      });
      navigate("/login");
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        "No se pudo registrar. Intenta de nuevo.";
      setToast(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Registro de Empresa</h1>
        <p className={styles.subtitle}>
          Completa tus datos para crear una cuenta
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <input
              type="text"
              name="username"
              placeholder="Correo"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="text"
              name="companyName"
              placeholder="Nombre de la Empresa"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="text"
              name="position"
              placeholder="Cargo"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className={styles.loginSection}>
            <p>¿Ya tienes una cuenta?</p>
            <a href="/login" className={styles.loginLink}>
              Iniciar Sesión
            </a>
          </div>
        </form>

        {toast && (
          <div className={styles.toast} role="alert">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
