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

  // Si no hay data, redirigimos
  useEffect(() => {
    if (!accountData) {
      navigate("/accounts");
    }
  }, [accountData, navigate]);

  // Estados inicializados
  const [name, setName] = useState(accountData?.name || "");
  const [selectedBuOwnerId, setSelectedBuOwnerId] = useState(accountData?.buOwner.id || "");
  const [strategy, setStrategy] = useState(accountData?.strategy || "");
  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [error, setError] = useState("");

  // Cargamos BU Owners
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

  // Submit de actualización
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const buOwnerObject = buOwners.find((bu) => bu.id === selectedBuOwnerId);
    if (!buOwnerObject) {
      setError("Please select a valid BU Owner");
      return;
    }

    const updatedAccount: Account = {
      id: accountId as string,
      name,
      buOwner: {
        id: buOwnerObject.id,
        name: buOwnerObject.name,
      },
      portfolio: {
        id: portfolio?.id || "",
        name: portfolio?.name || "No Portfolio",
      },
      status: "active",
      strategy,
    };

    try {
      await updateAccount(updatedAccount);
      navigate("/accounts");
    } catch (err: any) {
      setError("Error updating account: " + err.message);
    }
  };

  const handleCancel = () => navigate("/accounts");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        {/* Solo una pestaña activa */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.activeTab}`}>Details</button>
        </div>

        <h2 className={styles.sectionTitle}>Edit Account Details</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Row de tres columnas */}
          <div className={styles.row}>
            {/* Name */}
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

            {/* BU Owner */}
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

            {/* Portfolio */}
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
          </div>

          {/* Strategy textarea */}
          <div className={styles.formGroup}>
            <label htmlFor="strategy" className={styles.label}>
              What’s the strategy/objectives with this account?
            </label>
            <textarea
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className={styles.textarea}
              rows={6}
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
    </div>
  );
};

export default AccountEditPage;
