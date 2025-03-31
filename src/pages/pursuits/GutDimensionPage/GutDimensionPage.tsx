import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./GutDimensionPage.module.css";
import { createGutDimension } from "../../../service/projectService";
import { GutDimension } from "../../../types/GutDimension";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const GutDimensionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer projectId del state de navegación
  const projectId = location.state?.projectId;
  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState("Not Defined");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dimensionId = uuidv4();
    const newGutDimension: GutDimension = {
      id: dimensionId,
      observations,
      status: status as "Good" | "Warning" | "Bad" | "Not Defined",
    };

    try {
      await createGutDimension(projectId, newGutDimension);
      // Después de guardar, redirige a la vista principal de pursuits o a la siguiente pestaña
      navigate("/pursuits");
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Gut Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
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

export default GutDimensionPage;
