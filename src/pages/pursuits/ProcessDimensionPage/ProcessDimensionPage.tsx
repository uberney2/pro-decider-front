// src/pages/pursuits/create-pursuit/ProcessDimensionPage.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./ProcessDimensionPage.module.css";
import { createProcessDimension } from "../../../service/projectService";
import { ProcessDimension } from "../../../types/ProcessDimension";
import { AccountabilityLevelEnum } from "../../../types/ProcessDimension"; // Asegúrate de que la ruta sea la correcta

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const ProcessDimensionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer projectId del state de navegación
  const projectId = location.state?.projectId;
  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  // Estados para los campos de Process
  const [stack, setStack] = useState("");
  const [methodology, setMethodology] = useState("");
  const [frequencyToDeploy, setFrequencyToDeploy] = useState("");
  const [latamInfluence, setLatamInfluence] = useState("");
  const [accountabilityLevel, setAccountabilityLevel] = useState(AccountabilityLevelEnum.RESPONSIBLE_100);
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState("Not Defined");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dimensionId = uuidv4();
    const newProcessDimension: ProcessDimension = {
      id: dimensionId,
      stack,
      methodology,
      frequencyToDeploy,
      latamInfluence,
      accountabilityLevel,
      observations,
      status: status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createProcessDimension(projectId, newProcessDimension);
      // Después de guardar, redirige a la vista principal de pursuits o la siguiente pestaña
      navigate("/pursuits");
    } catch (err: any) {
      setError("Error creating process dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Process Dimension</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Process Description</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Which is the technology stack (back, front, BD, Integration, Testing)</label>
            <textarea
              value={stack}
              onChange={(e) => setStack(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Agile Methodology and process description</label>
            <textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Frequency to deploy</label>
            <textarea
              value={frequencyToDeploy}
              onChange={(e) => setFrequencyToDeploy(e.target.value)}
            />
          </div>
          {/* Eliminamos el textarea para Accountability Level y lo sustituimos por un dropdown */}
          <div className={styles.formGroup}>
            <label>Accountability Level</label>
            <select
              value={accountabilityLevel}
              onChange={(e) => setAccountabilityLevel(e.target.value as AccountabilityLevelEnum)}
            >
              {Object.values(AccountabilityLevelEnum).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Latam Influence</label>
            <textarea
              value={latamInfluence}
              onChange={(e) => setLatamInfluence(e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Process Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Process Observation</label>
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

export default ProcessDimensionPage;
