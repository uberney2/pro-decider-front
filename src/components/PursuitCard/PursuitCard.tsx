// src/components/PursuitCard/PursuitCard.tsx
import React, { useEffect, useState } from "react";
import styles from "./PursuitCard.module.css";
import { Project } from "../../types/Project";
import { getDimensionStatus } from "../../service/projectService";

interface Props {
  project: Project;
}

export const PursuitCard: React.FC<Props> = ({ project }) => {
  const [dimensions, setDimensions] = useState<{
    plan: string;
    team: string;
    process: string;
    qa: string;
    gut: string;
  }>({
    plan: "Not Defined",
    team: "Not Defined",
    process: "Not Defined",
    qa: "Not Defined",
    gut: "Not Defined",
  });

  useEffect(() => {
    const loadDimensions = async () => {
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
        console.error("Error fetching dimensions for project:", project.id, err);
      }
    };
    loadDimensions();
  }, [project.id]);

  const getStatusColor = (status: string) => {
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

  return (
    <div className={styles.card}>
      <h4>{project.name}</h4>
      <p>Account: {project.account.name}</p>
      <p>Portfolio: {project.account.portfolio.name}</p>
      <p>Contract Type: {project.contractType}</p>
      <p>GM %: {project.gmPercentage}</p>
      <p>Total SOW: {project.totalSOW}</p>

      <div className={styles.dimensions}>
        <span className={`${styles.dimension} ${getStatusColor(dimensions.plan)}`}>
          Plan
        </span>
        <span className={`${styles.dimension} ${getStatusColor(dimensions.team)}`}>
          Team
        </span>
        <span className={`${styles.dimension} ${getStatusColor(dimensions.process)}`}>
          Process
        </span>
        <span className={`${styles.dimension} ${getStatusColor(dimensions.qa)}`}>
          QA
        </span>
        <span className={`${styles.dimension} ${getStatusColor(dimensions.gut)}`}>
          Get Feeling
        </span>
      </div>
    </div>
  );
};
