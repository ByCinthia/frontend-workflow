// src/modules/dashboard/pages/Dashboard.tsx
import { useUser } from "../../user/context";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  const { user, logout } = useUser();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bienvenido, {user?.username} 🎉</h1>
        <p className={styles.text}>
          Este es tu panel de control protegido. Aquí podrás ver y gestionar la información financiera.
        </p>

        <button className={styles.button} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
