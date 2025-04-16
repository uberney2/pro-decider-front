// src/pages/pursuits/TeamDimensionPage/TeamDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamDimensionPage.module.css";
import { 
  getTeamDimension, 
  createTeamDimension, 
  updateTeamDimension 
} from "../../../service/projectService";
import { TeamDimension } from "../../../types/TeamDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";

// Importaciones de React Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const TeamDimensionPage: React.FC = () => {
  const { projectId } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState<TeamDimension>({
    id: "",
    composition: "",
    teamConfiguration: "",
    englishLevel: "",
    deployDate: "",
    status: "Not Defined",
    observations: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      getTeamDimension(projectId)
        .then((data) => {
          if (data && data.id) {
            setTeamData(data);
          }
        })
        .catch((err) => {
          console.warn("No team dimension data found, initializing empty.", err);
        });
    }
  }, [projectId]);

  const handleChange = (field: keyof TeamDimension, value: string) => {
    setTeamData({ ...teamData, [field]: value });
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
      if (teamData.id) {
        // Actualizar dimensión existente
        await updateTeamDimension(projectId, teamData.id, teamData);
        toast.success("Team dimension updated successfully!");
      } else {
        // Crear nueva dimensión
        const newId = uuidv4();
        const newData: TeamDimension = { ...teamData, id: newId };
        await createTeamDimension(projectId, newData);
        setTeamData(newData);
        setMessage("Team dimension created successfully.");
        toast.success("Team dimension created successfully!");
      }
    } catch (err: any) {
      const errMsg = "Error saving team dimension: " + err.message;
      console.error(errMsg);
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Team Dimension</h2>

      {/* Mensajes en pantalla (opcional si todavía se desea mostrar) */}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Team Composition Risk</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Composition</label>
            <textarea
              value={teamData.composition}
              onChange={(e) => handleChange("composition", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Team Configuration</label>
            <textarea
              value={teamData.teamConfiguration}
              onChange={(e) => handleChange("teamConfiguration", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>English Level Required</label>
            <textarea
              value={teamData.englishLevel}
              onChange={(e) => handleChange("englishLevel", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expected Deploy Date</label>
            <input
              type="date"
              value={teamData.deployDate}
              onChange={(e) => handleChange("deployDate", e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Team Status</label>
            <select
              value={teamData.status}
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
            <label>Team Observations</label>
            <textarea
              value={teamData.observations}
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

      {/* ToastContainer para mostrar los mensajes de react-toastify */}
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

export default TeamDimensionPage;
