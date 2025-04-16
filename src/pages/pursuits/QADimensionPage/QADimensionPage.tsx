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

// Importaciones de react-toastify
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      getQADimension(projectId)
        .then((data) => {
          if (data && data.id) {
            setQaData(data);
          }
        })
        .catch((err) => {
          console.warn("No QA dimension data found, initializing empty.", err);
        });
    }
  }, [projectId]);

  const handleChange = (field: keyof QADimension, value: string | boolean) => {
    setQaData({ ...qaData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!projectId) {
      const errMsg = "No project ID found.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    try {
      if (qaData.id) {
        // Actualizar QA Dimension existente
        await updateQADimension(projectId, qaData.id, qaData);
        toast.success("QA dimension updated successfully!");
      } else {
        // Crear nueva QA Dimension
        const newId = uuidv4();
        const newData: QADimension = { ...qaData, id: newId };
        await createQADimension(projectId, newData);
        setQaData(newData);
        toast.success("QA dimension created successfully!");
      }
    } catch (err: any) {
      console.error("Error saving QA dimension:", err);
      const errMsg = "Error saving QA dimension: " + err.message;
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>QA Dimension</h2>

      {/* Mensajes en pantalla (opcional, además de los toasts) */}
      {error && <p className={styles.error}>{error}</p>}
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
            <select
              value={qaData.status}
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
            <label>QA Observations</label>
            <textarea
              value={qaData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save &amp; continue
          </button>
        </div>
      </form>

      {/* Contenedor de Toastify para mensajes */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default QADimensionPage;
