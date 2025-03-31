// src/pages/pursuits/create-pursuit/NewPursuitDetailsForm.tsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./NewPursuitPage.module.css";

// Servicios
import { getBuOwners } from "../../../service/buOwnerService";
import { getAccounts } from "../../../service/accountService";
import { createProject } from "../../../service/projectService";

// Tipos
import { Account, BuOwner } from "../../../types/Account";
import { TagInput } from "../../../components/TagInput/TagInput";

// Constantes para dropdowns
const CONTACT_TYPES = ["Time & Materials", "Fixed Fee"];
const PURSUIT_TYPES = ["pursuit", "project"];
const PURSUIT_STATUS = [
  "Open",
  "Preanalysis",
  "Engineering Review",
  "In Validation",
  "Cancelled",
];

import { AuthContext } from "../../../context/AuthContext";
import { Project } from "../../../types/Project";

const NewPursuitDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio } = useContext(AuthContext);

  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // BU & Financial Information
  const [primarySalesBU, setPrimarySalesBU] = useState("");
  const [gmPercentage, setGmPercentage] = useState("");
  const [totalSOW, setTotalSOW] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [contactType, setContactType] = useState(CONTACT_TYPES[0]);

  // Pursuit Data
  const [pursuitName, setPursuitName] = useState("");
  const [contactTags, setContactTags] = useState<string[]>([]);
  const [pursuitStartDate, setPursuitStartDate] = useState("");
  const [responsibleTags, setResponsibleTags] = useState<string[]>([]);
  const [pursuitKind, setPursuitKind] = useState(PURSUIT_TYPES[0]);
  const [status, setStatus] = useState(PURSUIT_STATUS[0]);
  const [pursuitEndDate, setPursuitEndDate] = useState("");
  const [securityProcedures, setSecurityProcedures] = useState("");
  const [onboardingProcess, setOnboardingProcess] = useState("");
  const [scopeServices, setScopeServices] = useState("");
  const [levelOfAccountUncertainty, setLevelOfAccountUncertainty] = useState("");
  const [fullTimeEmployees, setFullTimeEmployees] = useState("");
  const [averageBillingRate, setAverageBillingRate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [buData, accountData] = await Promise.all([
          getBuOwners(),
          getAccounts(),
        ]);
        setBuOwners(buData);
        setAccounts(accountData);
      } catch (err: any) {
        console.error("Error loading BU or Account data:", err);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const buSelected = buOwners.find((bu) => bu.id === primarySalesBU);
    const accountSelected = accounts.find((acc) => acc.id === selectedAccountId);

    if (!buSelected) {
      setError("Please select a valid Primary Sales BU.");
      return;
    }
    if (!accountSelected) {
      setError("Please select a valid Account.");
      return;
    }
    if (!portfolio) {
      setError("No portfolio information found. Please log in again.");
      return;
    }

    const generatedProjectId = uuidv4();

    const newProject: Project = {
      id: generatedProjectId,
      account: {
        id: accountSelected.id,
        name: accountSelected.name,
        buOwner: {
          id: buSelected.id,
          name: buSelected.name,
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
      name: pursuitName,
      fullTimeEmployees: fullTimeEmployees,
      averageBillingRate: averageBillingRate,
      totalHours: totalHours,
      closingProbability: "",
      latamRevenue: "",
      latamParticipationPercentage: "",
      activeEmployees: "",
      gmPercentage: gmPercentage,
      totalSOW: totalSOW,
      contractType: contactType,
      usaPointOfContact: contactTags.join(", "),
      pursuitStartDate: pursuitStartDate,
      pursuitEndDate: pursuitEndDate,
      status: status,
      statusChangeDate: new Date().toISOString(),
      additionalBackground: securityProcedures,
      onboardingProcess: onboardingProcess,
      servicesScope: scopeServices,
      levelOfAccount: levelOfAccountUncertainty,
      responsibleFromLatam: responsibleTags,
    };

    try {
      await createProject(newProject);
      // Navega a la pestaña Team para continuar con las dimensiones
      navigate("/pursuits/new/team", { state: { projectId: generatedProjectId } });
    } catch (err: any) {
      setError("Error creating project: " + err.message);
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
            value={primarySalesBU}
            onChange={(e) => setPrimarySalesBU(e.target.value)}
            required
          >
            <option value="">-- Select BU --</option>
            {buOwners.map((bu) => (
              <option key={bu.id} value={bu.id}>
                {bu.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>GM Percentage</label>
          <input
            type="text"
            value={gmPercentage}
            onChange={(e) => setGmPercentage(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Total SOW</label>
          <input
            type="text"
            value={totalSOW}
            onChange={(e) => setTotalSOW(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Account name</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            required
          >
            <option value="">-- Select Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Contact Type</label>
          <select
            value={contactType}
            onChange={(e) => setContactType(e.target.value)}
            required
          >
            {CONTACT_TYPES.map((type) => (
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
            value={pursuitName}
            onChange={(e) => setPursuitName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <TagInput
            label="Contact"
            tags={contactTags}
            setTags={setContactTags}
            placeholder="Press Enter to add contact"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Pursuit Start Date</label>
          <input
            type="date"
            value={pursuitStartDate}
            onChange={(e) => setPursuitStartDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <TagInput
            label="Responsible"
            tags={responsibleTags}
            setTags={setResponsibleTags}
            placeholder="Press Enter to add responsible"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Type</label>
          <select
            value={pursuitKind}
            onChange={(e) => setPursuitKind(e.target.value)}
            required
          >
            {PURSUIT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {PURSUIT_STATUS.map((s) => (
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
            value={pursuitEndDate}
            onChange={(e) => setPursuitEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Are there any security procedures, additional background checks, or similar?</label>
          <textarea
            value={securityProcedures}
            onChange={(e) => setSecurityProcedures(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>What’s the onboarding process, tools, and timing to staff people to the team? (licences, VPN, Access, etc)</label>
          <textarea
            value={onboardingProcess}
            onChange={(e) => setOnboardingProcess(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Scope of the services</label>
          <textarea
            value={scopeServices}
            onChange={(e) => setScopeServices(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Level of account uncertainty</label>
          <textarea
            value={levelOfAccountUncertainty}
            onChange={(e) => setLevelOfAccountUncertainty(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Full time Employees</label>
          <input
            type="text"
            value={fullTimeEmployees}
            onChange={(e) => setFullTimeEmployees(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Average Billing Rate</label>
          <input
            type="text"
            value={averageBillingRate}
            onChange={(e) => setAverageBillingRate(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Total hours</label>
          <input
            type="text"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
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
  );
};

export default NewPursuitDetailsForm;
