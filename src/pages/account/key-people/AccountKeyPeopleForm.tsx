import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./AccountKeyPeopleForm.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { KeyPerson } from "../../../types/KeyPerson";
import { createKeyPerson, linkAccountKeyPeople } from "../../../service/accountService";
import { useLocation } from "react-router-dom";

const KeyPeopleForm: React.FC = () => {
  const location = useLocation();
  const accountId = location.state?.accountId;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !role || !email) {
      const errMsg = "Please fill in all fields.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (!accountId) {
      const errMsg = "No account ID provided.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    const newKeyPerson: KeyPerson = {
      id: uuidv4(),
      name,
      role,
      email,
    };

    try {
      await createKeyPerson(newKeyPerson);
      await linkAccountKeyPeople(accountId, newKeyPerson.id);
      toast.success("Key person saved and linked successfully!");
      setName("");
      setRole("");
      setEmail("");
    } catch (err: any) {
      setError(err.message);
      toast.error("Error saving key person: " + err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Key People</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter key person name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              placeholder="Enter role"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter email"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttons}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
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

export default KeyPeopleForm;
