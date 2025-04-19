// src/pages/pursuits/TeamDimensionPage/TeamDimensionPage.tsx
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamDimensionPage.module.css";

import {
  getTeamDimension,
  createTeamDimension,
  updateTeamDimension,
} from "../../../service/projectService";
import { TeamDimension } from "../../../types/TeamDimension";
import { OutletContextProps } from "../edit-pursuit/EditPursuitPageContainer";
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

  useEffect(() => {
    if (projectId) {
      getTeamDimension(projectId)
        .then((data) => data?.id && setTeamData(data))
        .catch((err) => console.warn("No team dimension data found", err));
    }
  }, [projectId]);

  const handleChange = (field: keyof TeamDimension, value: string) =>
    setTeamData({ ...teamData, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("No project ID found.");

    try {
      if (teamData.id) {
        await updateTeamDimension(projectId, teamData.id, teamData);
        toast.success("Team dimension updated successfully!");
      } else {
        const newData = { ...teamData, id: uuidv4() };
        await createTeamDimension(projectId, newData);
        setTeamData(newData);
        toast.success("Team dimension created successfully!");
      }
    } catch (err: any) {
      toast.error("Error saving team dimension: " + err.message);
    }
  };

  const handleCancel = () =>
    navigate("/pursuits/edit/" + projectId + "/details", { state: { projectId } });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Team Dimension</h2>

      <form className={styles.card} onSubmit={handleSubmit}>
        {/* ---------- Team composition risk ---------- */}
        <h3 className={styles.subTitle}>Team Composition Risk</h3>

        <div className={styles.grid3}>
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

          {/* Expected Deploy Date alineado en la columna 1 */}
          <div className={styles.formGroup}>
            <label>Expected Deploy Date</label>
            <input
              type="date"
              value={teamData.deployDate}
              onChange={(e) => handleChange("deployDate", e.target.value)}
            />
          </div>
        </div>

        {/* ---------- Status information ---------- */}
        <h3 className={styles.subTitle}>Status Information</h3>
        <div className={styles.statusGrid}>
          <div className={styles.formGroup}>
            <label>Team Status</label>
            <select
              value={teamData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.below}`}>
            <label>Team Observations</label>
            <textarea
              value={teamData.observations}
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

export default TeamDimensionPage;
