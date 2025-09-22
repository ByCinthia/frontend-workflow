// src/modules/dashboard/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  const user = { username: "Workflow de Gestión Financiera" };
  const logout = () => {};

  const modules = [
    { title: "Usuarios", path: "/dashboard/users" },
    { title: "Planes y Suscripciones", path: "/dashboard/plans" },
    { title: "Créditos", path: "/dashboard/credits" },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>🏦 WF Finanzas</h2>
        <nav>
          <ul className={styles.menu}>
            {modules.map((m) => (
              <li key={m.path}>
                <Link to={m.path} className={styles.menuLink}>
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className={styles.logout} onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className={styles.content}>
        <h1 className={styles.title}>Bienvenido, {user.username} 🎉</h1>
        <p className={styles.text}>
          Selecciona un módulo del menú lateral para continuar.
        </p>
      </main>
    </div>
  );
}
