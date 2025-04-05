// src/pages/pursuits/edit-pursuit/EditPursuitDetailsForm.tsx
import React, { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { TagInput } from "../../../components/TagInput/TagInput";
import styles from "../../pursuits/create-pursuit/NewPursuitPage.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { updateProject } from "../../../service/projectService";
import { Project } from "../../../types/Project";
import { DetailsData } from "../../../types/DetailsData";
import { OutletContextProps } from "../create-pursuit/NewPursuitPageContainer";

const CONTACT_TYPES = ["Time & Materials", "Fixed Fee"];
const PURSUIT_TYPES = ["pursuit", "project"];
const PURSUIT_STATUS = ["Open", "Preanalysis", "Engineering Review", "In Validation", "Cancelled"];

const EditPursuitDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { detailsData, setDetailsData, projectId } = useOutletContext<OutletContextProps>();
  const { portfolio } = useContext(AuthContext);
  const [error, setError] = React.useState("");

  const handleChange = (field: keyof DetailsData, value: string) => {
    setDetailsData({ ...detailsData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!portfolio || !projectId) {
      alert("Missing portfolio information or project ID. Please log in again.");
      return;
    }

    const updatedProject: Project = {
      id: projectId,
      account: {
        id: detailsData.accountId,
        name: detailsData.accountName,
        buOwner: {
          id: detailsData.buOwnerId,
          name: detailsData.buOwnerName,
        },
        portfolio: {
          id: portfolio.id,
          name: portfolio.name,
        },
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
      alert("Project details updated successfully.");
    } catch (err: any) {
      console.error("Error updating project:", err);
      setError("Error updating project: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/pursuits");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.subSectionTitle}>BU & Financial Information</h3>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Primary sales BU</label>
          <select
            value={detailsData.primarySalesBU}
            onChange={(e) => handleChange("primarySalesBU", e.target.value)}
            required
          >
            <option value="">-- Select BU --</option>
            {/* Lista de BU cargada globalmente */}
          </select>
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
          <select
            value={detailsData.accountId}
            onChange={(e) => handleChange("accountId", e.target.value)}
            required
          >
            <option value="">-- Select Account --</option>
            {/* Lista de cuentas cargada globalmente */}
          </select>
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
            tags={detailsData.usaPointOfContact ? detailsData.usaPointOfContact.split(", ") : []}
            setTags={(tags) => handleChange("usaPointOfContact", tags.join(", "))}
            placeholder="Press Enter to add contact"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Pursuit Start Date</label>
          <input
            type="date"
            value={detailsData.pursuitStartDate}
            onChange={(e) => handleChange("pursuitStartDate", e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <TagInput
            label="Responsible"
            tags={detailsData.responsibleFromLatam ? detailsData.responsibleFromLatam.split(", ") : []}
            setTags={(tags) => handleChange("responsibleFromLatam", tags.join(", "))}
            placeholder="Press Enter to add responsible"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Type</label>
          <select
            value={detailsData.pursuitKind}
            onChange={(e) => handleChange("pursuitKind", e.target.value)}
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
            onChange={(e) => handleChange("pursuitEndDate", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Are there any security procedures, additional background checks, or similar?</label>
          <textarea
            value={detailsData.additionalBackground}
            onChange={(e) => handleChange("additionalBackground", e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            What’s the onboarding process, tools, and timing to staff people to the team? (licences, VPN, Access, etc)
          </label>
          <textarea
            value={detailsData.onboardingProcess}
            onChange={(e) => handleChange("onboardingProcess", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Scope of the services</label>
          <textarea
            value={detailsData.servicesScope}
            onChange={(e) => handleChange("servicesScope", e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Level of account uncertainty</label>
          <textarea
            value={detailsData.levelOfAccount}
            onChange={(e) => handleChange("levelOfAccount", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Full time Employees</label>
          <input
            type="text"
            value={detailsData.fullTimeEmployees}
            onChange={(e) => handleChange("fullTimeEmployees", e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Average Billing Rate</label>
          <input
            type="text"
            value={detailsData.averageBillingRate}
            onChange={(e) => handleChange("averageBillingRate", e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Total hours</label>
          <input
            type="text"
            value={detailsData.totalHours}
            onChange={(e) => handleChange("totalHours", e.target.value)}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <button
          type="button"
          onClick={() => navigate("/pursuits")}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          Edit &amp; continue
        </button>
      </div>
    </form>
  );
};

export default EditPursuitDetailsForm;
