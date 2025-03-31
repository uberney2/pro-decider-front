// src/pages/pursuits/create-pursuit/TeamDimensionPage.tsx
import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamDimensionPage.module.css";
import { createTeamDimension } from "../../../service/projectService";
import { TeamDimension } from "../../../types/TeamDimension";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

interface OutletContextProps {
  projectId?: string;
}

const TeamDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  const [composition, setComposition] = useState("");
  const [teamConfiguration, setTeamConfiguration] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [deployDate, setDeployDate] = useState("");
  const [status, setStatus] = useState("Not Defined");
  const [observations, setObservations] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dimensionId = uuidv4();
    const newTeamDimension: TeamDimension = {
      id: dimensionId,
      composition,
      teamConfiguration,
      englishLevel,
      observations,
      deployDate: deployDate
        ? new Date(deployDate).toISOString()
        : new Date().toISOString(),
      status: status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createTeamDimension(projectId, newTeamDimension);
      navigate("/pursuits");
    } catch (err: any) {
      setError("Error creating team dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Team Dimension</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Team Composition Risk</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Composition</label>
            <textarea
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Team Configuration</label>
            <textarea
              value={teamConfiguration}
              onChange={(e) => setTeamConfiguration(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>English Level Required</label>
            <textarea
              value={englishLevel}
              onChange={(e) => setEnglishLevel(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expected Deploy Date</label>
            <input
              type="date"
              value={deployDate}
              onChange={(e) => setDeployDate(e.target.value)}
            />
          </div>
        </div>
        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Team Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Team Observations</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttons}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save &amp; continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamDimensionPage;
