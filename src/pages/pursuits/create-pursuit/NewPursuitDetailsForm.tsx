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
import { AuthContext } from "../../../context/AuthContext";
import { Project } from "../../../types/Project";
import { DetailsData } from "../../../types/DetailsData";

const CONTACT_TYPES = ["Time & Materials", "Fixed Fee"];
const PURSUIT_TYPES = ["pursuit", "project"];
const PURSUIT_STATUS = [
  "Open",
  "Preanalysis",
  "Engineering Review",
  "In Validation",
  "Cancelled",
];

const NewPursuitDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio } = useContext(AuthContext);

  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Para creación: Se selecciona la cuenta y se extrae la info de BU
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [accountData, setAccountData] = useState<{ buOwnerName: string } | null>(null);

  // Otros campos editables
  const [pursuitName, setPursuitName] = useState("");
  const [contactTags, setContactTags] = useState<string[]>([]);
  const [pursuitStartDate, setPursuitStartDate] = useState("");
  const [responsibleTags, setResponsibleTags] = useState<string[]>([]);
  const [pursuitKind, setPursuitKind] = useState(PURSUIT_TYPES[0]);
  const [status, setStatus] = useState(PURSUIT_STATUS[0]);
  const [pursuitEndDate, setPursuitEndDate] = useState("");
  const [securityProcedures, setSecurityProcedures] = useState("");
  const [onboardingProcess, setOnboardingProcess] = useState("");
  const [servicesScope, setServicesScope] = useState("");  // Renombrado a servicesScope
  const [levelOfAccount, setLevelOfAccount] = useState("");
  const [fullTimeEmployees, setFullTimeEmployees] = useState("");
  const [averageBillingRate, setAverageBillingRate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [buData, accountData] = await Promise.all([getBuOwners(), getAccounts()]);
        setBuOwners(buData);
        setAccounts(accountData);
      } catch (err: any) {
        console.error("Error loading BU or Account data:", err);
      }
    })();
  }, []);

  const handleAccountChange = (value: string) => {
    setSelectedAccountId(value);
    const selectedAccount = accounts.find((acc) => acc.id === value);
    if (selectedAccount) {
      setAccountData({ buOwnerName: selectedAccount.buOwner.name });
    } else {
      setAccountData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!portfolio) {
      setError("No portfolio information found. Please log in again.");
      return;
    }
    if (!selectedAccountId || !accountData) {
      setError("Please select a valid Account.");
      return;
    }

    const generatedProjectId = uuidv4();

    const newProject: Project = {
      id: generatedProjectId,
      account: {
        id: selectedAccountId,
        name: accounts.find((acc) => acc.id === selectedAccountId)?.name || "",
        buOwner: {
          id: "", // No editable
          name: accountData.buOwnerName,
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
      fullTimeEmployees,
      averageBillingRate,
      totalHours,
      closingProbability: "",
      latamRevenue: "",
      latamParticipationPercentage: "",
      activeEmployees: "",
      gmPercentage: "", // Si es necesario, se puede agregar o eliminar
      totalSOW: "",      // Si es necesario
      contractType: CONTACT_TYPES[0], // Valor por defecto (no editable en este caso)
      usaPointOfContact: contactTags.join(", "),
      pursuitStartDate,
      pursuitEndDate,
      status,
      statusChangeDate: new Date().toISOString(),
      additionalBackground: securityProcedures,
      onboardingProcess,
      servicesScope, // Se utiliza la variable servicesScope
      levelOfAccount,
      responsibleFromLatam: responsibleTags,
    };

    try {
      await createProject(newProject);
      // Luego de guardar, redirige a la pestaña Team para continuar con las dimensiones
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
        {/* Selección de cuenta */}
        <div className={styles.formGroup}>
          <label>Account name</label>
          <select
            value={selectedAccountId}
            onChange={(e) => handleAccountChange(e.target.value)}
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
        {/* Campo informativo: Primary sales BU (solo lectura) */}
        <div className={styles.formGroup}>
          <label>Primary sales BU</label>
          <input type="text" value={accountData ? accountData.buOwnerName : ""} readOnly />
        </div>
        {/* Campo informativo: Portfolio */}
        <div className={styles.formGroup}>
          <label>Portfolio</label>
          <input type="text" value={portfolio ? portfolio.name : ""} readOnly />
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
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
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
          <label>
            What’s the onboarding process, tools, and timing to staff people to the team? (licences, VPN, Access, etc)
          </label>
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
            value={servicesScope}
            onChange={(e) => setServicesScope(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Level of account uncertainty</label>
          <textarea
            value={""} // Si se requiere, puedes modificar este campo según tu modelo
            readOnly
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
        <button type="button" onClick={() => navigate("/pursuits")} className={styles.cancelButton}>
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
