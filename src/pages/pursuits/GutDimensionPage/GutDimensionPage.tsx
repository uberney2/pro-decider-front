// src/pages/pursuits/create-pursuit/GutDimensionPage.tsx
import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./GutDimensionPage.module.css";
import { createGutDimension } from "../../../service/projectService";
import { GutDimension } from "../../../types/GutDimension";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";

const STATUS_OPTIONS: Array<"Good" | "Warning" | "Bad" | "Not Defined"> = [
  "Good",
  "Warning",
  "Bad",
  "Not Defined",
];

const GutDimensionPage: React.FC = () => {
  const { projectId, gutData, setGutData } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (!projectId) {
    return <div className={styles.error}>Project ID not found. Please create the Pursuit first.</div>;
  }

  const handleChange = (field: keyof Omit<GutDimension, "id">, value: string) => {
    setGutData({ ...gutData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const dimensionId = uuidv4();
    const newGutDimension: GutDimension = {
      id: dimensionId,
      observations: gutData.observations,
      status: gutData.status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createGutDimension(projectId, newGutDimension);
      setMessage("Gut dimension saved successfully. You can continue editing this dimension or add another.");
      // No limpiamos el estado para que los datos persistan
    } catch (err: any) {
      setError("Error creating gut dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Gut Dimension</h2>
      <p className={styles.description}>
        In addition to the previous points, how is your feeling of the team's general health? Also consider external factors such as the relationship with the client or other factors that may represent a risk to the health of the project.
      </p>
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Gut Status</label>
            <select
              value={gutData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Gut Observations</label>
            <textarea
              value={gutData.observations}
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

export default GutDimensionPage;
