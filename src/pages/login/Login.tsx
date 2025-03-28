import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, LoginResponse, LoginCredentials } from "../../service/authService";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Login.module.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      const credentials: LoginCredentials = { email, password };
  
      try {
        const data: LoginResponse = await login(credentials);
        setToken(data.access_token);
        localStorage.setItem("access_token", data.access_token);
        navigate("/home");
      } catch (err: any) {
        setError(
          "Error al iniciar sesión: " +
            (err.response?.data?.message || err.message)
        );
      }
    };
  
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Correo electrónico:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className={styles.input}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Ingresar</button>
        </form>
      </div>
    );
  };

export default Login;