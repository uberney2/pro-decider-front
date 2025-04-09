// src/pages/account/create/AccountCreatePageContainer.tsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./AccountCreatePageContainer.module.css";

// Este contenedor se encargará de mostrar las pestañas y el Outlet para mostrar el formulario seleccionado

const AccountCreatePageContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar la pestaña actual a partir de la URL
  const currentTab = location.pathname.split("/").pop() || "details";

  const handleTabClick = (tab: string) => {
    navigate(`/accounts/new/${tab}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${currentTab === "details" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("details")}
        >
          Details
        </button>
        <button
          className={`${styles.tab} ${currentTab === "keypeople" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("keypeople")}
        >
          Key People
        </button>
        <button
          className={`${styles.tab} ${currentTab === "projects" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("projects")}
          disabled
        >
          Projects
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default AccountCreatePageContainer;
