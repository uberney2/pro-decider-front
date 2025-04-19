// src/pages/pursuits/PlanDimensionPage/PlanDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./PlanDimensionPage.module.css";

import {
  getPlanDimension,
  createPlanDimension,
  updatePlanDimension,
} from "../../../service/projectService";
import { PlanDimension } from "../../../types/PlanDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";
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

  useEffect(() => {
    if (projectId) {
      getPlanDimension(projectId)
        .then((data) => data?.id && setPlanData(data))
        .catch((err) => console.warn("No plan dimension data found", err));
    }
  }, [projectId]);

  const handleChange = (field: keyof PlanDimension, value: string) =>
    setPlanData({ ...planData, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("No project ID found.");

    try {
      if (planData.id) {
        await updatePlanDimension(projectId, planData.id, planData);
        toast.success("Plan dimension updated successfully!");
      } else {
        const payload = { ...planData, id: uuidv4() };
        await createPlanDimension(projectId, payload);
        setPlanData(payload);
        toast.success("Plan dimension created successfully!");
      }
    } catch (err: any) {
      toast.error("Error saving plan dimension: " + err.message);
    }
  };

  const handleCancel = () =>
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Plan Dimension</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        {/* ---------- Plan information ---------- */}
        <h3 className={styles.subTitle}>Plan Information</h3>
        <div className={styles.grid3}>
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

        {/* ---------- Status information ---------- */}
        <h3 className={styles.subTitle}>Status Information</h3>
        <div className={styles.statusGrid}>
          <div className={styles.formGroup}>
            <label>Plan Status</label>
            <select
              value={planData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.below}`}>
            <label>Plan Observations</label>
            <textarea
              value={planData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
            />
          </div>
        </div>

        {/* ---------- Botones ---------- */}
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

export default PlanDimensionPage;
