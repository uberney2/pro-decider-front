// src/pages/pursuits/ProcessDimensionPage/ProcessDimensionPage.tsx
import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./ProcessDimensionPage.module.css";
import { createProcessDimension } from "../../../service/projectService";
import { ProcessDimension, AccountabilityLevelEnum } from "../../../types/ProcessDimension";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";

const STATUS_OPTIONS: Array<"Good" | "Warning" | "Bad" | "Not Defined"> = [
  "Good",
  "Warning",
  "Bad",
  "Not Defined",
];

const ProcessDimensionPage: React.FC = () => {
  // Usamos el Outlet Context para obtener el estado global de processData
  const { projectId, processData, setProcessData } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  const handleChange = (field: keyof ProcessDimension, value: string) => {
    setProcessData({ ...processData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const dimensionId = uuidv4();
    const newProcessDimension: ProcessDimension = {
      id: dimensionId,
      stack: processData.stack,
      methodology: processData.methodology,
      frequencyToDeploy: processData.frequencyToDeploy,
      latamInfluence: processData.latamInfluence,
      accountabilityLevel: processData.accountabilityLevel, // El dropdown se usará para seleccionar una de las opciones del enum
      observations: processData.observations,
      status: processData.status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createProcessDimension(projectId, newProcessDimension);
      setMessage("Process dimension saved successfully. You can continue editing this dimension or add another.");
      // Si prefieres limpiar los campos para un nuevo ingreso, puedes descomentar lo siguiente:
      // setProcessData({
      //   stack: "",
      //   methodology: "",
      //   frequencyToDeploy: "",
      //   latamInfluence: "",
      //   accountabilityLevel: AccountabilityLevelEnum.RESPONSIBLE_100,
      //   observations: "",
      //   status: "Not Defined",
      // });
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
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Process Description</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Which is the technology stack (back, front, BD, Integration, Testing)</label>
            <textarea
              value={processData.stack}
              onChange={(e) => handleChange("stack", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Agile Methodology and process description</label>
            <textarea
              value={processData.methodology}
              onChange={(e) => handleChange("methodology", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Frequency to deploy</label>
            <textarea
              value={processData.frequencyToDeploy}
              onChange={(e) => handleChange("frequencyToDeploy", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Latam Influence</label>
            <textarea
              value={processData.latamInfluence}
              onChange={(e) => handleChange("latamInfluence", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Accountability Level</label>
            <select
              value={processData.accountabilityLevel}
              onChange={(e) => handleChange("accountabilityLevel", e.target.value)}
            >
              {Object.values(AccountabilityLevelEnum).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Process Status</label>
            <select value={processData.status} onChange={(e) => handleChange("status", e.target.value)}>
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
              value={processData.observations}
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

export default ProcessDimensionPage;
