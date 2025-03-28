import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
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
      </ul>
    </nav>
  );
};

export default Navbar;
