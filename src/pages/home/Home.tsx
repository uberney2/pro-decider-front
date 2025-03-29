import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


const Home: React.FC = () => {
  const { token } = useContext(AuthContext);

  return (
    <div >
      <h1>Bienvenido a Home</h1>
      <p>
        {token
          ? `Estás autenticado. Token: ${token}`
          : "No estás autenticado."}
      </p>
    </div>
  );
};

export default Home;