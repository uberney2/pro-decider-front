import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./AccountEditPage.module.css";
import { updateAccount } from "../../../service/accountService"; 
import { getBuOwners } from "../../../service/buOwnerService";
import { AuthContext } from "../../../context/AuthContext";
import { Account, BuOwner } from "../../../types/Account";


const AccountEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams<{ accountId: string }>();
  const { portfolio } = useContext(AuthContext);

  // Extraemos la cuenta del state del router
  const accountData: Account | undefined = location.state?.account;

  // Si no se recibió data, redirigimos al listado (esto evita errores)
  useEffect(() => {
    if (!accountData) {
      navigate("/accounts");
    }
  }, [accountData, navigate]);

  // Estados para los campos, inicializados con la data recibida
  const [name, setName] = useState(accountData?.name || "");
  const [selectedBuOwnerId, setSelectedBuOwnerId] = useState(accountData?.buOwner.id || "");
  const [strategy, setStrategy] = useState(accountData?.strategy || "");
  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [error, setError] = useState("");

  // Cargar BU Owners para el dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await getBuOwners();
        setBuOwners(data);
      } catch (err: any) {
        setError("Error fetching BU Owners: " + err.message);
      }
    })();
  }, []);

  // Maneja la actualización de la cuenta
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const buOwnerObject = buOwners.find((bu) => bu.id === selectedBuOwnerId);
    if (!buOwnerObject) {
      setError("Please select a valid BU Owner");
      return;
    }

    const updatedAccount: Account = {
      id: accountId as string,  // Usamos el id de la URL
      name,
      buOwner: {
        id: buOwnerObject.id,
        name: buOwnerObject.name,
      },
      portfolio: {
        id: portfolio?.id || "",
        name: portfolio?.name || "No Portfolio",
      },
      status: "active", // Se mantiene activo
      strategy,
    };

    try {
      await updateAccount(updatedAccount);
      navigate("/accounts");
    } catch (err: any) {
      setError("Error updating account: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/accounts");
  };

  return (
    <div className={styles.container}>
      {/* Pestañas */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>Details</button>
        <button className={styles.tab} disabled>Key People</button>
        <button className={styles.tab} disabled>Projects</button>
      </div>

      <h2 className={styles.sectionTitle}>Edit Account Details</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo: Name */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* Campo: BU Owner (dropdown) */}
        <div className={styles.formGroup}>
          <label htmlFor="buOwner" className={styles.label}>BU Owner</label>
          <select
            id="buOwner"
            value={selectedBuOwnerId}
            onChange={(e) => setSelectedBuOwnerId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">-- Select a BU Owner --</option>
            {buOwners.map((bu) => (
              <option key={bu.id} value={bu.id}>{bu.name}</option>
            ))}
          </select>
        </div>

        {/* Campo: Portfolio (no editable) */}
        <div className={styles.formGroup}>
          <label htmlFor="portfolio" className={styles.label}>Portfolio</label>
          <input
            id="portfolio"
            type="text"
            value={portfolio?.name || "No Portfolio"}
            readOnly
            className={styles.input}
          />
        </div>

        {/* Campo: Strategy */}
        <div className={styles.formGroup}>
          <label htmlFor="strategy" className={styles.label}>
            What's the strategy/objectives with this account?
          </label>
          <textarea
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className={styles.textarea}
            rows={4}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Edit and Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountEditPage;