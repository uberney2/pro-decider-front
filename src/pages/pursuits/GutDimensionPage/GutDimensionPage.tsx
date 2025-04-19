// src/pages/pursuits/GutDimensionPage/GutDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./GutDimensionPage.module.css";
import {
  getGutDimension,
  createGutDimension,
  updateGutDimension,
} from "../../../service/projectService";
import { GutDimension } from "../../../types/GutDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const GutDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [gutData, setGutData] = useState<GutDimension>({
    id: "",
    observations: "",
    status: "Not Defined",
  });

  useEffect(() => {
    if (projectId) {
      getGutDimension(projectId)
        .then((d) => d?.id && setGutData(d))
        .catch((err) => console.warn("No gut dimension data", err));
    }
  }, [projectId]);

  const handleChange = (field: keyof GutDimension, value: string) =>
    setGutData({ ...gutData, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("No project ID found.");

    try {
      if (gutData.id) {
        await updateGutDimension(projectId, gutData.id, gutData);
        toast.success("Gut dimension updated successfully!");
      } else {
        const payload = { ...gutData, id: uuidv4() };
        await createGutDimension(projectId, payload);
        setGutData(payload);
        toast.success("Gut dimension created successfully!");
      }
    } catch (err: any) {
      toast.error("Error saving gut dimension: " + err.message);
    }
  };

  const handleCancel = () =>
    navigate(`/pursuits/edit/${projectId}/details`, { state: { projectId } });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Gut Dimension</h2>
      <p className={styles.description}>
        In addition to the previous points, how is your feeling of the team's general
        health? Also consider external factors such as the relationship with the client
        or other factors that may represent a risk to the health of the project.
      </p>

      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label>Gut Status</label>
            <select
              value={gutData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.span2}`}>
            <label>Gut Observations</label>
            <textarea
              value={gutData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn}>
            Save &amp; continue
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default GutDimensionPage;
