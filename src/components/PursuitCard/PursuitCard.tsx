// src/components/PursuitCard/PursuitCard.tsx

import React, { useEffect, useState } from "react";
import styles from "./PursuitCard.module.css";
import { Project } from "../../types/Project";
import { getDimensionStatus } from "../../service/projectService";

export interface PursuitCardProps {
  project: Project;
  onEdit: (projectId: string) => void;
}

interface DimensionsState {
  team: string;
  plan: string;
  process: string;
  qa: string;
  gut: string;
}

const PursuitCard: React.FC<PursuitCardProps> = ({ project, onEdit }) => {
  const [dimensions, setDimensions] = useState<DimensionsState>({
    team: "Not Defined",
    plan: "Not Defined",
    process: "Not Defined",
    qa: "Not Defined",
    gut: "Not Defined",
  });

  useEffect(() => {
    (async () => {
      try {
        const [plan, team, process, qa, gut] = await Promise.all([
          getDimensionStatus(project.id, "plan"),
          getDimensionStatus(project.id, "team"),
          getDimensionStatus(project.id, "process"),
          getDimensionStatus(project.id, "qa"),
          getDimensionStatus(project.id, "gut"),
        ]);
        setDimensions({ plan, team, process, qa, gut });
      } catch (err) {
        console.error("Error fetching dimensions:", err);
      }
    })();
  }, [project.id]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Good":
        return styles.statusGood;
      case "Warning":
        return styles.statusWarning;
      case "Bad":
        return styles.statusBad;
      default:
        return styles.statusUndefined;
    }
  };

  const lastUpdated = project.statusChangeDate
    ? new Date(project.statusChangeDate).toLocaleDateString()
    : "N/A";

  return (
    <div className={styles.card}>
      {/* Icono de editar más pequeño y sin recuadro */}
      <button
        type="button"
        className={styles.editIcon}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(project.id);
        }}
        draggable={false}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.iconSvg}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Información principal */}
      <div className={styles.infoSection}>
        <h3 className={styles.pursuitName}>{project.name}</h3>
        <p className={styles.accountName}>{project.account.name}</p>
        <p className={styles.portfolioName}>{project.account.portfolio.name}</p>
        <p className={styles.contactLabel}>Contact</p>
        <p className={styles.contactName}>
          {project.usaPointOfContact || "No contact"}
        </p>
      </div>

      {/* Dimensiones en dos filas */}
      <div className={styles.dimensionsSection}>
        <div className={styles.dimensionsRow}>
          <span className={`${styles.dimensionChip} ${getStatusClass(dimensions.team)}`}>
            Team
          </span>
          <span className={`${styles.dimensionChip} ${getStatusClass(dimensions.plan)}`}>
            Plan
          </span>
          <span className={`${styles.dimensionChip} ${getStatusClass(dimensions.process)}`}>
            Process
          </span>
        </div>
        <div className={styles.dimensionsRow}>
          <span className={`${styles.dimensionChip} ${getStatusClass(dimensions.qa)}`}>
            QA
          </span>
          <span className={`${styles.dimensionChip} ${getStatusClass(dimensions.gut)}`}>
            Get Feeling
          </span>
        </div>
      </div>

      {/* Última actualización */}
      <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
    </div>
  );
};

export default PursuitCard;
