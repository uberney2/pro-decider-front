// src/pages/pursuits/ProcessDimensionPage/ProcessDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./ProcessDimensionPage.module.css";

import {
  getProcessDimension,
  createProcessDimension,
  updateProcessDimension,
} from "../../../service/projectService";
import { ProcessDimension } from "../../../types/ProcessDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const ProcessDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [processData, setProcessData] = useState<ProcessDimension>({
    id: "",
    stack: "",
    methodology: "",
    frequencyToDeploy: "",
    latamInfluence: "",
    accountabilityLevel: "",
    observations: "",
    status: "Not Defined",
  });

  useEffect(() => {
    if (projectId) {
      getProcessDimension(projectId)
        .then((data) => data?.id && setProcessData(data))
        .catch((err) => console.warn("No process dimension data found", err));
    }
  }, [projectId]);

  const handleChange = (field: keyof ProcessDimension, value: string) =>
    setProcessData({ ...processData, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("No project ID found.");

    try {
      if (processData.id) {
        await updateProcessDimension(projectId, processData.id, processData);
        toast.success("Process dimension updated successfully!");
      } else {
        const payload = { ...processData, id: uuidv4() };
        await createProcessDimension(projectId, payload);
        setProcessData(payload);
        toast.success("Process dimension created successfully!");
      }
    } catch (err: any) {
      toast.error("Error saving process dimension: " + err.message);
    }
  };

  const handleCancel = () =>
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Process Dimension</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        {/* ---------- Process description ---------- */}
        <h3 className={styles.subTitle}>Process Description</h3>
        <div className={styles.grid3}>
          <div className={styles.formGroup}>
            <label>Technology Stack (back, front, BD, Integration, Testing)</label>
            <textarea
              value={processData.stack}
              onChange={(e) => handleChange("stack", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Agile Methodology and Process Description</label>
            <textarea
              value={processData.methodology}
              onChange={(e) => handleChange("methodology", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Frequency to Deploy</label>
            <textarea
              value={processData.frequencyToDeploy}
              onChange={(e) => handleChange("frequencyToDeploy", e.target.value)}
            />
          </div>

          {/* fila 2 */}
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
              <option value="">-- Select --</option>
              <option value="Responsible 100%">Responsible 100%</option>
              <option value="Based on our definition">Based on our definition</option>
              <option value="Shared Responsibility">Shared Responsibility</option>
              <option value="Based on Client">Based on Client</option>
              <option value="Staff Aumentation">Staff Aumentation</option>
            </select>
          </div>
        </div>

        {/* ---------- Status information ---------- */}
        <h3 className={styles.subTitle}>Status Information</h3>
        <div className={styles.statusGrid}>
          <div className={styles.formGroup}>
            <label>Process Status</label>
            <select
              value={processData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.below}`}>
            <label>Process Observations</label>
            <textarea
              value={processData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
            />
          </div>
        </div>

        {/* ---------- botones ---------- */}
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

export default ProcessDimensionPage;
