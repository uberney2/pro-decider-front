// src/pages/pursuits/PlanDimensionPage/PlanDimensionPage.tsx
import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./PlanDimensionPage.module.css";
import { createPlanDimension } from "../../../service/projectService";
import { PlanDimension } from "../../../types/PlanDimension";
import { OutletContextProps } from "../../pursuits/create-pursuit/NewPursuitPageContainer";

const STATUS_OPTIONS: Array<"Good" | "Warning" | "Bad" | "Not Defined"> = [
  "Good",
  "Warning",
  "Bad",
  "Not Defined",
];

const PlanDimensionPage: React.FC = () => {
  const { projectId, planData, setPlanData } = useOutletContext<OutletContextProps>();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (!projectId) {
    return <div className={styles.error}>Project ID not found.</div>;
  }

  const handleChange = (field: keyof PlanDimension, value: string) => {
    setPlanData({ ...planData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const dimensionId = uuidv4();
    const newPlanDimension: PlanDimension = {
      id: dimensionId,
      backlogResponsible: planData.backlogResponsible,
      roadMap: planData.roadMap,
      deliverables: planData.deliverables,
      status: planData.status as "Good" | "Warning" | "Bad" | "Not Defined",
      observations: planData.observations,
    };

    try {
      await createPlanDimension(projectId, newPlanDimension);
      setMessage("Plan dimension saved successfully. You can continue editing this dimension or add another.");
      // No limpiamos el estado para que persista la información
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
      {message && <p className={styles.success}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>Pursuit Plan</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>
              Who is/will be responsible for backlog management and User stories documentation
            </label>
            <textarea
              value={planData.backlogResponsible}
              onChange={(e) => handleChange("backlogResponsible", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>
              Is there a roadmap or an execution plan for the deliverables? If so, how was it estimated?
            </label>
            <textarea
              value={planData.roadMap}
              onChange={(e) => handleChange("roadMap", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>
              What are the deliverables and timelines? In what time frame do you expect to achieve them?
            </label>
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
