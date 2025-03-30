import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import Accounts from "./pages/account/Account"; 
import Pursuits from "./pages/pursuits/Pursuits"; 
import ProtectedLayout from "./pages/ProtectedLayout/protectedLayout";
import { AuthProvider } from "./context/AuthContext";
import AccountCreatePage from "./pages/account/create-account/AccountCreatePage";
import AccountEditPage from "./pages/account/edit-account/AccountEditPage";
import NewPursuitPage from "./pages/pursuits/create-pursuit/NewPursuitPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/pursuits" element={<Pursuits />} />
            <Route path="/accounts/new" element={<AccountCreatePage />} />
            <Route path="/accounts/:accountId" element={<AccountEditPage />} />
            <Route path="/pursuits/new" element={<NewPursuitPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);