// src/pages/pursuits/create-pursuit/QADimensionPage.tsx
import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./QADimensionPage.module.css";
import { createQADimension } from "../../../service/projectService";
import { QADimension } from "../../../types/QADimension";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";

const STATUS_OPTIONS: Array<"Good" | "Warning" | "Bad" | "Not Defined"> = [
  "Good",
  "Warning",
  "Bad",
  "Not Defined",
];

const QADimensionPage: React.FC = () => {
  const { projectId, qaData, setQaData } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (!projectId) {
    return <div className={styles.error}>Project ID not found. Please create the Pursuit first.</div>;
  }

  const handleChange = (field: keyof QADimension, value: string | boolean) => {
    setQaData({ ...qaData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const dimensionId = uuidv4();
    const newQADimension: QADimension = {
      id: dimensionId,
      currentStatus: qaData.currentStatus,
      testTools: qaData.testTools,
      automationLevel: qaData.automationLevel,
      manualProcess: qaData.manualProcess,
      automatedProcess: qaData.automatedProcess,
      observations: qaData.observations,
      status: qaData.status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createQADimension(projectId, newQADimension);
      setMessage("QA dimension saved successfully. You can continue editing this dimension or add another.");
      // Si se desea limpiar el estado para nuevos datos, se podría:
      // setQaData({ currentStatus: "", testTools: "", automationLevel: "", manualProcess: false, automatedProcess: false, observations: "", status: "Not Defined" });
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
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>QA Composition Risk</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>What is the current status for QA?</label>
            <textarea
              value={qaData.currentStatus}
              onChange={(e) => handleChange("currentStatus", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Are there existing tools for defect management, test cases management, code management, also automation?</label>
            <textarea
              value={qaData.testTools}
              onChange={(e) => handleChange("testTools", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>What is the automation level? (based on the QA Pyramid)</label>
            <textarea
              value={qaData.automationLevel}
              onChange={(e) => handleChange("automationLevel", e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>
          About QA Process <small>(Both can be picked if necessary)</small>
        </h3>
        <div className={styles.formRow}>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={qaData.manualProcess}
                onChange={(e) => handleChange("manualProcess", e.target.checked)}
              />
              Manual
            </label>
          </div>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={qaData.automatedProcess}
                onChange={(e) => handleChange("automatedProcess", e.target.checked)}
              />
              Automation
            </label>
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>QA Status</label>
            <select value={qaData.status} onChange={(e) => handleChange("status", e.target.value)}>
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
              value={qaData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
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
