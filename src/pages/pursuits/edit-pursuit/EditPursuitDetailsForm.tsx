// src/pages/pursuits/edit-pursuit/EditPursuitDetailsForm.tsx
import React, { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { TagInput } from "../../../components/TagInput/TagInput";
import styles from "../../pursuits/create-pursuit/NewPursuitPage.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { updateProject } from "../../../service/projectService";
import { Project } from "../../../types/Project";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPursuitDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { detailsData, setDetailsData, projectId } = useOutletContext<OutletContextProps>();
  const { portfolio } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof detailsData, value: string) => {
    setDetailsData({ ...detailsData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!portfolio || !projectId) {
      toast.error("Missing portfolio information or project ID. Please log in again.");
      return;
    }

    const updatedProject: Project = {
      id: projectId,
      account: {
        id: detailsData.accountId,
        name: detailsData.accountName,
        buOwner: { id: detailsData.buOwnerId, name: detailsData.buOwnerName },
        portfolio: { id: portfolio.id, name: portfolio.name },
        status: "Activo",
        salesforceLink: "https://salesforce.example.com/cuenta",
        pcsLink: "https://pcs.example.com/cuenta",
        strategy: "Default strategy",
      },
      name: detailsData.pursuitName,
      gmPercentage: detailsData.gmPercentage,
      totalSOW: detailsData.totalSOW,
      fullTimeEmployees: detailsData.fullTimeEmployees,
      averageBillingRate: detailsData.averageBillingRate,
      totalHours: detailsData.totalHours,
      closingProbability: "",
      latamRevenue: "",
      latamParticipationPercentage: "",
      activeEmployees: "",
      contractType: detailsData.contractType,
      usaPointOfContact: detailsData.usaPointOfContact,
      pursuitStartDate: detailsData.pursuitStartDate,
      pursuitEndDate: detailsData.pursuitEndDate,
      status: detailsData.status,
      statusChangeDate: new Date().toISOString(),
      additionalBackground: detailsData.additionalBackground,
      onboardingProcess: detailsData.onboardingProcess,
      servicesScope: detailsData.servicesScope,
      levelOfAccount: detailsData.levelOfAccount,
      responsibleFromLatam: detailsData.responsibleFromLatam
        ? detailsData.responsibleFromLatam.split(", ")
        : [],
    };

    try {
      await updateProject(updatedProject);
      toast.success("Project details updated successfully.");
    } catch (err: any) {
      const msg = "Error updating project: " + err.message;
      setError(msg);
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.subSectionTitle}>BU & Financial Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Primary sales BU</label>
            <input type="text" value={detailsData.buOwnerName} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Portfolio</label>
            <input
              type="text"
              value={portfolio ? portfolio.name : ""}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label>GM Percentage</label>
            <input
              type="text"
              value={detailsData.gmPercentage}
              onChange={(e) => handleChange("gmPercentage", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Total SOW</label>
            <input
              type="text"
              value={detailsData.totalSOW}
              onChange={(e) => handleChange("totalSOW", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Account name</label>
            <input type="text" value={detailsData.accountName} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Type</label>
            <select
              value={detailsData.contractType}
              onChange={(e) => handleChange("contractType", e.target.value)}
              required
            >
              {["Time & Materials", "Fixed Fee"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className={styles.subSectionTitle}>Pursuit Data</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Pursuit name</label>
            <input
              type="text"
              value={detailsData.pursuitName}
              onChange={(e) => handleChange("pursuitName", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <TagInput
              label="Contact"
              tags={
                detailsData.usaPointOfContact
                  ? detailsData.usaPointOfContact.split(", ")
                  : []
              }
              setTags={(tags) =>
                handleChange("usaPointOfContact", tags.join(", "))
              }
              placeholder="Press Enter to add contact"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Pursuit Start Date</label>
            <input
              type="date"
              value={detailsData.pursuitStartDate}
              onChange={(e) =>
                handleChange("pursuitStartDate", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <TagInput
              label="Responsible"
              tags={
                detailsData.responsibleFromLatam
                  ? detailsData.responsibleFromLatam.split(", ")
                  : []
              }
              setTags={(tags) =>
                handleChange("responsibleFromLatam", tags.join(", "))
              }
              placeholder="Press Enter to add responsible"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              value={detailsData.contractType}
              onChange={(e) => handleChange("contractType", e.target.value)}
              required
            >
              {["pursuit", "project"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              value={detailsData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              required
            >
              {["Open", "Preanalysis", "Engineering Review", "In Validation", "Cancelled"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Pursuit End Date</label>
            <input
              type="date"
              value={detailsData.pursuitEndDate}
              onChange={(e) =>
                handleChange("pursuitEndDate", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Security procedures?</label>
            <textarea
              value={detailsData.additionalBackground}
              onChange={(e) =>
                handleChange("additionalBackground", e.target.value)
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Onboarding process</label>
            <textarea
              value={detailsData.onboardingProcess}
              onChange={(e) =>
                handleChange("onboardingProcess", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Scope of the services</label>
            <textarea
              value={detailsData.servicesScope}
              onChange={(e) =>
                handleChange("servicesScope", e.target.value)
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Level of account uncertainty</label>
            <textarea
              value={detailsData.levelOfAccount}
              onChange={(e) =>
                handleChange("levelOfAccount", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full time Employees</label>
            <input
              type="text"
              value={detailsData.fullTimeEmployees}
              onChange={(e) =>
                handleChange("fullTimeEmployees", e.target.value)
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Average Billing Rate</label>
            <input
              type="text"
              value={detailsData.averageBillingRate}
              onChange={(e) =>
                handleChange("averageBillingRate", e.target.value)
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Total hours</label>
            <input
              type="text"
              value={detailsData.totalHours}
              onChange={(e) =>
                handleChange("totalHours", e.target.value)
              }
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Edit &amp; continue
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EditPursuitDetailsForm;
