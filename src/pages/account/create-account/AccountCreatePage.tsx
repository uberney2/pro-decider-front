// src/pages/AccountCreatePage.tsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./AccountCreatePage.module.css";

import { getBuOwners } from "../../../service/buOwnerService";
import { createAccount } from "../../../service/accountService";
import { AuthContext } from "../../../context/AuthContext";

import { Account, BuOwner  } from "../../../types/Account";


const AccountCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio } = useContext(AuthContext); 
  // Se asume que AuthContext provee { portfolio: { id, name } }

  // Campos del formulario
  const [name, setName] = useState("");
  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [selectedBuOwnerId, setSelectedBuOwnerId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [error, setError] = useState("");

  // Cargar la lista de BU Owners al montar
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

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Generar un UUID para la cuenta
    const accountId = uuidv4();

    // Obtener el BU Owner seleccionado
    const buOwnerObject = buOwners.find((bu) => bu.id === selectedBuOwnerId);
    if (!buOwnerObject) {
      setError("Please select a valid BU Owner");
      return;
    }

    // Construir el objeto Account
    const newAccount: Account = {
      id: accountId,
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
      await createAccount(newAccount);
      navigate("/accounts"); // Vuelve a la lista
    } catch (err: any) {
      setError("Error creating account: " + err.message);
    }
  };

  // Botón "Cancel"
  const handleCancel = () => {
    navigate("/accounts");
  };

  return (
    <div className={styles.container}>
      {/* Pestañas */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>Details</button>
        <button className={styles.tab} disabled>
          Key People
        </button>
        <button className={styles.tab} disabled>
          Projects
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Account Details</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Nombre de la cuenta */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name can't be modified"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* BU Owner (dropdown) */}
        <div className={styles.formGroup}>
          <label htmlFor="buOwner" className={styles.label}>
            BU Owner
          </label>
          <select
            id="buOwner"
            value={selectedBuOwnerId}
            onChange={(e) => setSelectedBuOwnerId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">-- Select a BU Owner --</option>
            {buOwners.map((bu) => (
              <option key={bu.id} value={bu.id}>
                {bu.name}
              </option>
            ))}
          </select>
        </div>

        {/* Portfolio (No editable) */}
        <div className={styles.formGroup}>
          <label htmlFor="portfolio" className={styles.label}>
            Portfolio
          </label>
          <input
            id="portfolio"
            type="text"
            value={portfolio?.name || "No Portfolio"}
            readOnly
            className={styles.input}
          />
        </div>

        {/* Strategy */}
        <div className={styles.formGroup}>
          <label htmlFor="strategy" className={styles.label}>
            What's the strategy/objectives with this account?
          </label>
          <textarea
            id="strategy"
            placeholder="Describe the strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className={styles.textarea}
            rows={4}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Botones */}
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save &amp; Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreatePage;
