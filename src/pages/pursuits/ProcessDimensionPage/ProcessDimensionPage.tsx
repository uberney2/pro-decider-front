// src/pages/pursuits/ProcessDimensionPage/ProcessDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./ProcessDimensionPage.module.css";
import { 
  getProcessDimension, 
  createProcessDimension, 
  updateProcessDimension 
} from "../../../service/projectService";
import { ProcessDimension } from "../../../types/ProcessDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";

// Importaciones de react-toastify
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

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      getProcessDimension(projectId)
        .then((data) => {
          if (data && data.id) {
            setProcessData(data);
          }
        })
        .catch((err) => {
          console.warn("No process dimension data found, initializing empty.", err);
        });
    }
  }, [projectId]);

  const handleChange = (field: keyof ProcessDimension, value: string) => {
    setProcessData((prev) => ({ ...prev, [field]: value }));
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
      if (processData.id) {
        // Actualizamos la dimensión si ya existe
        await updateProcessDimension(projectId, processData.id, processData);
        setMessage("Process dimension updated successfully.");
      } else {
        // Creación de una nueva dimensión
        const newId = uuidv4();
        const newData: ProcessDimension = { ...processData, id: newId };
        await createProcessDimension(projectId, newData);
        setProcessData(newData);
        setMessage("Process dimension created successfully.");
        toast.success("Process dimension created successfully!");
      }
    } catch (err: any) {
      console.error("Error saving process dimension:", err);
      const errMsg = "Error saving process dimension: " + err.message;
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Process Dimension</h2>

      {/* Mensajes en pantalla (opcional, además de los toasts) */}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Process Description</h3>
        <div className={styles.formRow}>
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

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Process Status</label>
            <select
              value={processData.status}
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
            <label>Process Observations</label>
            <textarea
              value={processData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save &amp; continue
          </button>
        </div>
      </form>

      {/* Contenedor de Toastify */}
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

export default ProcessDimensionPage;
