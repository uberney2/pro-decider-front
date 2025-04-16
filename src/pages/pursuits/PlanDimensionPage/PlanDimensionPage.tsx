// src/pages/pursuits/PlanDimensionPage/PlanDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./PlanDimensionPage.module.css";
import { 
  getPlanDimension, 
  createPlanDimension, 
  updatePlanDimension 
} from "../../../service/projectService";
import { PlanDimension } from "../../../types/PlanDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";

// Importaciones para Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const PlanDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [planData, setPlanData] = useState<PlanDimension>({
    id: "",
    backlogResponsible: "",
    roadMap: "",
    deliverables: "",
    status: "Not Defined",
    observations: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      getPlanDimension(projectId)
        .then((data) => {
          if (data && data.id) {
            setPlanData(data);
          }
        })
        .catch((err) => {
          console.warn("No plan dimension data found, initializing empty.", err);
        });
    }
  }, [projectId]);

  const handleChange = (field: keyof PlanDimension, value: string) => {
    setPlanData({ ...planData, [field]: value });
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
      if (planData.id) {
        // Actualizamos la dimensión si ya existe un ID
        await updatePlanDimension(projectId, planData.id, planData);
        toast.success("Plan dimension updated successfully!");
      } else {
        // De lo contrario creamos una nueva dimensión
        const newId = uuidv4();
        const newData: PlanDimension = { ...planData, id: newId };
        await createPlanDimension(projectId, newData);
        setPlanData(newData);
        setMessage("Plan dimension created successfully.");
        toast.success("Plan dimension created successfully!");
      }
    } catch (err: any) {
      console.error("Error saving plan dimension:", err);
      const errMsg = "Error saving plan dimension: " + err.message;
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Plan Dimension</h2>

      {/* Mensajes en pantalla (opcional si deseas mostrarlos además de los toasts) */}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Plan Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Backlog Responsible</label>
            <textarea
              value={planData.backlogResponsible}
              onChange={(e) => handleChange("backlogResponsible", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Road Map</label>
            <textarea
              value={planData.roadMap}
              onChange={(e) => handleChange("roadMap", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Deliverables and Timelines</label>
            <textarea
              value={planData.deliverables}
              onChange={(e) => handleChange("deliverables", e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Plan Status</label>
            <select
              value={planData.status}
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
            <label>Plan Observations</label>
            <textarea
              value={planData.observations}
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

      {/* Contenedor de Toastify para mostrar los toasts */}
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

export default PlanDimensionPage;
