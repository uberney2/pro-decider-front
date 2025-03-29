import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, LoginResponse, LoginCredentials } from "../../service/authService";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Login.module.css"; // Asegúrate de tener este archivo

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const credentials: LoginCredentials = { email, password };

    try {
      const data: LoginResponse = await login(credentials);
      // Actualiza el contexto con token y portfolio
      setAuthData({ token: data.access_token, portfolio: data.portfolio });
      navigate("/home");
    } catch (err: any) {
      setError(
        "Error al iniciar sesión: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;