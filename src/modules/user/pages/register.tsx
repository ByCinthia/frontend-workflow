import { useState, type FormEvent } from "react";
import { registerReq } from "../api";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí irá la lógica de registro con tu API
      await registerReq({
        username: formData.username,
        email: formData.username, // Assuming username can also be email for registration
        password: formData.password,
      });
      navigate('/login');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Registro de Empresa</h1>
        <p className={styles.subtitle}>Completa tus datos para crear una cuenta</p>

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

          <button 
            className={styles.button} 
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className={styles.loginSection}>
            <p>¿Ya tienes una cuenta?</p>
            <a href="/login" className={styles.loginLink}>
              Iniciar Sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
