

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./AccountCreatePage.module.css";
import { getBuOwners } from "../../../service/buOwnerService";
import { createAccount } from "../../../service/accountService";
import { AuthContext } from "../../../context/AuthContext";
import { Account, BuOwner, Portfolio } from "../../../types/Account";  // <-- added Portfolio

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyPeopleForm from "../key-people/AccountKeyPeopleForm";

const AccountCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { portfolio: ctxPortfolio } = useContext(AuthContext);

  // Campos para Details
  const [name, setName] = useState("");
  const [buOwners, setBuOwners] = useState<BuOwner[]>([]);
  const [selectedBuOwnerId, setSelectedBuOwnerId] = useState("");
  const [strategy, setStrategy] = useState("");
  const [error, setError] = useState("");


  const [accountData, setAccountData] = useState<{ buOwnerName: string } | null>(null);


  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [portfolioData, setPortfolioData] = useState<{ portfolioName: string } | null>(null);


 
  useEffect(() => {
    (async () => {
      try {
        const data = await getBuOwners();
        setBuOwners(data);
      } catch (err: any) {
        setError("Error fetching BU Owners: " + err.message);
        toast.error("Error fetching BU Owners: " + err.message);
      }
    })();
  }, []);

 
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/portfolio");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: Portfolio[] = await res.json();
        setPortfolios(data);
      } catch (err: any) {
        console.error("Error fetching portfolios:", err);
        toast.error("Error fetching portfolios: " + err.message);
      }
    })();
  }, []);
  // ----------------------------------

  const handleBuOwnerChange = (value: string) => {
    setSelectedBuOwnerId(value);
    const selectedBU = buOwners.find((bu) => bu.id === value);
    if (selectedBU) {
      setAccountData({ buOwnerName: selectedBU.name });
    } else {
      setAccountData(null);
    }
  };

  // — NEW: manejar selección de Portfolio —
  const handlePortfolioChange = (value: string) => {
    setSelectedPortfolioId(value);
    const sel = portfolios.find((p) => p.id === value);
    if (sel) {
      setPortfolioData({ portfolioName: sel.name });
    } else {
      setPortfolioData(null);
    }
  };
  // --------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // validar BU Owner
    if (!selectedBuOwnerId || !accountData) {
      setError("Please select a valid BU Owner.");
      toast.error("Please select a valid BU Owner.");
      return;
    }

    // — NEW: validar Portfolio seleccionado —
    if (!selectedPortfolioId || !portfolioData) {
      setError("Please select a valid Portfolio.");
      toast.error("Please select a valid Portfolio.");
      return;
    }
   

    const accountId = uuidv4();
    const newAccount: Account = {
      id: accountId,
      name,
      buOwner: {
        id: selectedBuOwnerId,
        name: accountData.buOwnerName,
      },
      
      portfolio: {
        id: selectedPortfolioId,
        name: portfolioData.portfolioName,
      },
      status: "active",
      strategy,
    };

    try {
      await createAccount(newAccount);
      toast.success("Account created successfully.");
      navigate("/accounts/new/keypeople", { state: { accountId } });
    } catch (err: any) {
      setError("Error creating account: " + err.message);
      toast.error("Error creating account: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/accounts");
  };

  const handleTabClick = (tab: string) => {
    navigate(`/accounts/new/${tab}`, { state: { accountId: uuidv4() } });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              location.pathname.includes("details") ? styles.activeTab : ""
            }`}
            onClick={() => handleTabClick("details")}
          >
            Details
          </button>
          <button
            className={`${styles.tab} ${
              location.pathname.includes("keypeople") ? styles.activeTab : ""
            }`}
            onClick={() => handleTabClick("keypeople")}
          >
            Key People
          </button>
        </div>

        <Routes>
          <Route index element={<Navigate to="details" replace />} />
          <Route
            path="details"
            element={
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.sectionTitle}>Account Details</h2>

                <div className={styles.row}>
                  {/* Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      required
                    />
                    <small className={styles.readOnlyHint}></small>
                  </div>

                  {/* BU Owner */}
                  <div className={styles.formGroup}>
                    <label htmlFor="buOwner" className={styles.label}>
                      BU Owner
                    </label>
                    <input
                      id="buOwner"
                      type="text"
                      value={accountData ? accountData.buOwnerName : ""}
                      readOnly
                      className={styles.input}
                      placeholder="Select BU Owner"
                    />
                    <select
                      className={styles.selectOverlay}
                      value={selectedBuOwnerId}
                      onChange={(e) => handleBuOwnerChange(e.target.value)}
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

                  {/* Portfolio (dropdown igual a BU Owner) */}
                  <div className={styles.formGroup}>
                    <label htmlFor="portfolio" className={styles.label}>
                      Portfolio
                    </label>
                    <input
                      id="portfolio"
                      type="text"
                      value={portfolioData ? portfolioData.portfolioName : ""}
                      readOnly
                      className={styles.input}
                      placeholder="Select Portfolio"
                    />
                    <select
                      className={styles.selectOverlay}
                      value={selectedPortfolioId}
                      onChange={(e) => handlePortfolioChange(e.target.value)}
                      required
                    >
                      <option value="">-- Select a Portfolio --</option>
                      {portfolios.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
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
            }
          />
          <Route path="keypeople" element={<KeyPeopleForm />} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AccountCreatePage;
