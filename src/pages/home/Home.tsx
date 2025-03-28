import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Home: React.FC = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token del estado global y del almacenamiento local
    setToken(null);
    localStorage.removeItem("access_token");
    // Redirige al login
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido a Home</h1>
      <p>
        {token
          ? `Estás autenticado. Token: ${token}`
          : "No estás autenticado."}
      </p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Home;