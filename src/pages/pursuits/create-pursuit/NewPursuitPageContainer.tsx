// src/pages/pursuits/create-pursuit/NewPursuitPageContainer.tsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from "./NewPursuitPage.module.css";

interface OutletContextProps {
  projectId?: string;
}

const NewPursuitPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Conserva el state actual (por ejemplo, { projectId } si fue enviado desde Details)
  const currentState = location.state;

  // Extraemos el projectId si existe en el state
  const projectId = currentState?.projectId;

  // Determinar la pestaña actual a partir de la URL
  const currentTab = location.pathname.split("/").pop() || "details";

  const handleTabClick = (tab: string) => {
    // Al navegar, pasamos el state actual
    navigate(`/pursuits/new/${tab}`, { state: currentState });
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            (currentTab === "details" || location.pathname === "/pursuits/new") &&
            styles.activeTab
          }`}
          onClick={() => handleTabClick("details")}
        >
          Details
        </button>
        <button
          className={`${styles.tab} ${currentTab === "team" && styles.activeTab}`}
          onClick={() => handleTabClick("team")}
        >
          Team
        </button>
        <button className={styles.tab} disabled>
          Plan
        </button>
        <button className={styles.tab} disabled>
          Process
        </button>
        <button className={styles.tab} disabled>
          QA
        </button>
        <button className={styles.tab} disabled>
          Gut
        </button>
      </div>
      {/* Pasamos el projectId (si existe) al Outlet */}
      <Outlet context={{ projectId }} />
    </div>
  );
};

export default NewPursuitPageContainer;
