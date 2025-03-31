// src/pages/pursuits/create-pursuit/QADimensionPage.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./QADimensionPage.module.css";
import { createQADimension } from "../../../service/projectService";
import { QADimension } from "../../../types/QADimension";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const QADimensionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer projectId del state de navegación
  const projectId = location.state?.projectId;
  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  // Estados para QA
  const [currentStatus, setCurrentStatus] = useState("");
  const [testTools, setTestTools] = useState("");
  const [automationLevel, setAutomationLevel] = useState("");
  const [manualProcess, setManualProcess] = useState(false);
  const [automatedProcess, setAutomatedProcess] = useState(false);

  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState("Not Defined");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dimensionId = uuidv4();
    const newQADimension: QADimension = {
      id: dimensionId,
      currentStatus,
      testTools,
      automationLevel,
      manualProcess,
      automatedProcess,
      observations,
      status: status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createQADimension(projectId, newQADimension);
      // Después de guardar, redirige a la vista principal o la siguiente pestaña
      navigate("/pursuits");
    } catch (err: any) {
      setError("Error creating QA dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Pursuit QA</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>QA composition risk</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>What is the current status for QA?</label>
            <textarea
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Are there existing tools for defect management, test cases management code management, also automation?</label>
            <textarea
              value={testTools}
              onChange={(e) => setTestTools(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>What is the automation level? (based on the QA Pyramid)</label>
            <textarea
              value={automationLevel}
              onChange={(e) => setAutomationLevel(e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>About QA Process <small>(Both can be picked if necessary)</small></h3>
        <div className={styles.formRow}>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={manualProcess}
                onChange={(e) => setManualProcess(e.target.checked)}
              />
              Manual
            </label>
          </div>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={automatedProcess}
                onChange={(e) => setAutomatedProcess(e.target.checked)}
              />
              Automation
            </label>
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>QA Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>QA Observation</label>
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

export default QADimensionPage;
