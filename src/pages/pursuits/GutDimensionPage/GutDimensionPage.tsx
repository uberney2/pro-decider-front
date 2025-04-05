// src/pages/pursuits/GutDimensionPage/GutDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./GutDimensionPage.module.css";
import { getGutDimension, createGutDimension, updateGutDimension } from "../../../service/projectService";
import { GutDimension } from "../../../types/GutDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const GutDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [gutData, setGutData] = useState<GutDimension>({
    id: "",
    observations: "",
    status: "Not Defined",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      getGutDimension(projectId)
        .then((data) => {
          if (data && data.id) {
            setGutData(data);
          }
        })
        .catch((err) => {
          console.warn("No gut dimension data found, initializing empty.", err);
        });
    }
  }, [projectId]);

  const handleChange = (field: keyof GutDimension, value: string) => {
    setGutData({ ...gutData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!projectId) {
      setError("No project ID found.");
      return;
    }

    try {
      if (gutData.id) {
        await updateGutDimension(projectId, gutData.id, gutData);
        setMessage("Gut dimension updated successfully.");
      } else {
        const newId = uuidv4();
        const newData: GutDimension = { ...gutData, id: newId };
        await createGutDimension(projectId, newData);
        setGutData(newData);
        setMessage("Gut dimension created successfully.");
      }
    } catch (err: any) {
      console.error("Error saving gut dimension:", err);
      setError("Error saving gut dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Gut Dimension</h2>
      <p className={styles.description}>
        In addition to the previous points, how is your feeling of the team's general health? Also consider external factors such as the relationship with the client or other factors that may represent a risk to the health of the project.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Gut Status</label>
            <select value={gutData.status} onChange={(e) => handleChange("status", e.target.value)}>
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
