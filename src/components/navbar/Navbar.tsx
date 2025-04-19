import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { token, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("portfolio");
    navigate("/");
  };

  /** función para asignar clases dinámicamente a NavLink */
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <nav className={styles.navbar}>
      <span className={styles.brand}>Prodecider</span>

      <ul className={styles.navList}>
      <li>
          <NavLink to="/home" className={getLinkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/accounts" className={getLinkClass}>
            Accounts
          </NavLink>
        </li>
        <li>
          <NavLink to="/pursuits" className={getLinkClass}>
            Pursuits
          </NavLink>
        </li>
        
        {token && (
          <li>
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
