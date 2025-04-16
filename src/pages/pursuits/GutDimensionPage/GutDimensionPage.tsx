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

// Importaciones de react-toastify
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
      const errMsg = "No project ID found.";
      toast.error(errMsg);
      return;
    }

    try {
      if (gutData.id) {
        // Actualizar si la dimensión ya existe
        await updateGutDimension(projectId, gutData.id, gutData);
        toast.success("Gut dimension updated successfully!");
      } else {
        // Crear nueva dimensión
        const newId = uuidv4();
        const newData: GutDimension = { ...gutData, id: newId };
        await createGutDimension(projectId, newData);
        setGutData(newData);
        toast.success("Gut dimension created successfully!");
      }
    } catch (err: any) {
      const errMsg = "Error saving gut dimension: " + err.message;
      console.error(errMsg);
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate(`/pursuits/edit/${projectId}/details`, { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Gut Dimension</h2>
      <p className={styles.description}>
        In addition to the previous points, how is your feeling of the team's general health?
        Also consider external factors such as the relationship with the client or other factors
        that may represent a risk to the health of the project.
      </p>

      {/* Mensajes opcionales en pantalla */}
      {error && <p className={styles.error}>{error}</p>}
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

export default GutDimensionPage;
