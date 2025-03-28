import React from "react";
import styles from "./Accounts.module.css";

const Accounts: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Accounts</h1>
      <p>Esta es la página de Accounts. Aquí se mostrarán las cuentas disponibles.</p>
    </div>
  );
};

export default Accounts;