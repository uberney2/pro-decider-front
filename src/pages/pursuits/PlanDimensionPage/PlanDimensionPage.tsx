import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./PlanDimensionPage.module.css";
import { createPlanDimension } from "../../../service/projectService";
import { PlanDimension } from "../../../types/PlanDimension";

const STATUS_OPTIONS = ["Good", "Warning", "Bad", "Not Defined"];

const PlanDimensionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tomamos el projectId del state (o useOutletContext si usas esa técnica)
  const projectId = location.state?.projectId;
  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  // Campos para "Plan"
  const [backlogResponsible, setBacklogResponsible] = useState("");
  const [roadMap, setRoadMap] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [status, setStatus] = useState("Not Defined");
  const [observations, setObservations] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dimensionId = uuidv4();
    const newPlanDimension: PlanDimension = {
      id: dimensionId,
      backlogResponsible,
      roadMap,
      deliverables,
      status: status as "Good" | "Warning" | "Bad" | "Not Defined",
      observations,
    };

    try {
      await createPlanDimension(projectId, newPlanDimension);
      // Después de guardar, podrías ir a la vista de pursuits o a otra pestaña
      navigate("/pursuits");
    } catch (err: any) {
      setError("Error creating plan dimension: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Pursuit Plan</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Pursuit Plan</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Who is/will be responsible for backlog management and User stories documentatios</label>
            <textarea
              value={backlogResponsible}
              onChange={(e) => setBacklogResponsible(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Is there a roadmap or an execution plan for the deliverables? If so, How was estimated?</label>
            <textarea
              value={roadMap}
              onChange={(e) => setRoadMap(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>What are the deliverables and timelines *In what time frame do you expect to achieve them?</label>
            <textarea
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
            />
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Status Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Plan Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
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

export default PlanDimensionPage;
