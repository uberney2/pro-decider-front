// src/pages/pursuits/QADimensionPage/QADimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./QADimensionPage.module.css";

import {
  getQADimension,
  createQADimension,
  updateQADimension,
} from "../../../service/projectService";
import { QADimension } from "../../../types/QADimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const QADimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [qaData, setQaData] = useState<QADimension>({
    id: "",
    currentStatus: "",
    testTools: "",
    automationLevel: "",
    manualProcess: false,
    automatedProcess: false,
    observations: "",
    status: "Not Defined",
  });

  useEffect(() => {
    if (projectId) {
      getQADimension(projectId)
        .then((data) => data?.id && setQaData(data))
        .catch((err) => console.warn("No QA dimension data found", err));
    }
  }, [projectId]);

  const handleChange = (field: keyof QADimension, val: string | boolean) =>
    setQaData({ ...qaData, [field]: val });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("No project ID found.");

    try {
      if (qaData.id) {
        await updateQADimension(projectId, qaData.id, qaData);
        toast.success("QA dimension updated successfully!");
      } else {
        const payload = { ...qaData, id: uuidv4() };
        await createQADimension(projectId, payload);
        setQaData(payload);
        toast.success("QA dimension created successfully!");
      }
    } catch (err: any) {
      toast.error("Error saving QA dimension: " + err.message);
    }
  };

  const handleCancel = () =>
    navigate(`/pursuits/edit/${projectId}/details`, { state: { projectId } });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>QA Dimension</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        {/* -------- QA composition -------- */}
        <h3 className={styles.subTitle}>QA Composition Risk</h3>
        <div className={styles.grid3}>
          <div className={styles.formGroup}>
            <label>What is the current status for QA?</label>
            <textarea
              value={qaData.currentStatus}
              onChange={(e) => handleChange("currentStatus", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            {/* ← Texto original restaurado */}
            <label>
              Are there existing tools for defect management, test cases management,
              code management, also automation?
            </label>
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

        {/* -------- QA process -------- */}
        <h3 className={styles.subTitle}>
          About QA Process&nbsp;<small>(both can be picked)</small>
        </h3>
        <div className={styles.checkboxRow}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={qaData.manualProcess}
              onChange={(e) => handleChange("manualProcess", e.target.checked)}
            />
            Manual
          </label>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={qaData.automatedProcess}
              onChange={(e) => handleChange("automatedProcess", e.target.checked)}
            />
            Automation
          </label>
        </div>

        {/* -------- Status info -------- */}
        <h3 className={styles.subTitle}>Status Information</h3>
        <div className={styles.statusGrid}>
          <div className={styles.formGroup}>
            <label>QA Status</label>
            <select
              value={qaData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.below}`}>
            <label>QA Observations</label>
            <textarea
              value={qaData.observations}
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

export default QADimensionPage;
