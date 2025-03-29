// src/components/Navbar.tsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { token, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Cerrar sesión: borrar datos del contexto y del localStorage
    setAuthData(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("portfolio");
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/accounts" className={styles.navLink}>
            Accounts
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/pursuits" className={styles.navLink}>
            Pursuits
          </Link>
        </li>
        {token && (
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
