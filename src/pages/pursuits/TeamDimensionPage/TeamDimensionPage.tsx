// src/pages/pursuits/create-pursuit/TeamDimensionPage.tsx
import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamDimensionPage.module.css";
import { createTeamDimension } from "../../../service/projectService";
import { TeamDimension } from "../../../types/TeamDimension";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";

const STATUS_OPTIONS: Array<"Good" | "Warning" | "Bad" | "Not Defined"> = [
  "Good",
  "Warning",
  "Bad",
  "Not Defined",
];

const TeamDimensionPage: React.FC = () => {
  const { projectId, teamData, setTeamData } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!projectId) {
      setError("Project ID not found.");
      return;
    }

    const dimensionId = uuidv4();
    const newTeamDimension: TeamDimension = {
      id: dimensionId,
      composition: teamData.composition,
      teamConfiguration: teamData.teamConfiguration,
      englishLevel: teamData.englishLevel,
      observations: teamData.observations,
      deployDate: teamData.deployDate
        ? new Date(teamData.deployDate).toISOString()
        : new Date().toISOString(),
      status: teamData.status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createTeamDimension(projectId, newTeamDimension);
      setMessage("Team dimension saved successfully. You can continue editing this dimension or add another.");
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
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Team Composition Risk</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Composition</label>
            <textarea
              value={teamData.composition}
              onChange={(e) => setTeamData({ ...teamData, composition: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Team Configuration</label>
            <textarea
              value={teamData.teamConfiguration}
              onChange={(e) => setTeamData({ ...teamData, teamConfiguration: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>English Level Required</label>
            <textarea
              value={teamData.englishLevel}
              onChange={(e) => setTeamData({ ...teamData, englishLevel: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expected Deploy Date</label>
            <input
              type="date"
              value={teamData.deployDate}
              onChange={(e) => setTeamData({ ...teamData, deployDate: e.target.value })}
            />
          </div>
        </div>
        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Team Status</label>
            <select
              value={teamData.status}
              onChange={(e) => setTeamData({ ...teamData, status: e.target.value })}
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
              value={teamData.observations}
              onChange={(e) => setTeamData({ ...teamData, observations: e.target.value })}
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
