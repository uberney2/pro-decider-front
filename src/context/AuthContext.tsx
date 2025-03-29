// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export interface Portfolio {
  id: string;
  name: string;
}

interface AuthContextType {
  token: string | null;
  portfolio: Portfolio | null;
  setAuthData: (data: { token: string; portfolio: Portfolio } | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  portfolio: null,
  setAuthData: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedToken = localStorage.getItem("access_token");
  const storedPortfolio = localStorage.getItem("portfolio");
  const initialPortfolio = storedPortfolio ? JSON.parse(storedPortfolio) : null;

  const [token, setToken] = useState<string | null>(storedToken);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(initialPortfolio);

  const setAuthData = (data: { token: string; portfolio: Portfolio } | null) => {
    if (data) {
      setToken(data.token);
      setPortfolio(data.portfolio);
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("portfolio", JSON.stringify(data.portfolio));
    } else {
      setToken(null);
      setPortfolio(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("portfolio");
    }
  };

  return (
    <AuthContext.Provider value={{ token, portfolio, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
