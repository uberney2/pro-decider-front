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
import NewPursuitPage from "./pages/pursuits/create-pursuit/NewPursuitPageContainer";
import NewPursuitDetailsForm from "./pages/pursuits/NewPursuitDetailsForm/NewPursuitDetailsForm";
import TeamDimensionPage from "./pages/pursuits/TeamDimensionPage/TeamDimensionPage";
import NewPursuitPageContainer from "./pages/pursuits/create-pursuit/NewPursuitPageContainer";
import PlanDimensionPage from "./pages/pursuits/PlanDimensionPage/PlanDimensionPage";
import ProcessDimensionPage from "./pages/pursuits/ProcessDimensionPage/ProcessDimensionPage";
import QADimensionPage from "./pages/pursuits/QADimensionPage/QADimensionPage";
import GutDimensionPage from "./pages/pursuits/GutDimensionPage/GutDimensionPage";

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
            {/* Rutas anidadas para crear un Pursuit */}
            <Route path="/pursuits/new/*" element={<NewPursuitPageContainer />}>
              <Route index element={<NewPursuitDetailsForm />} />
              <Route path="details" element={<NewPursuitDetailsForm />} />
              <Route path="team" element={<TeamDimensionPage />} />
              <Route path="plan" element={<PlanDimensionPage />} />
              <Route path="process" element={<ProcessDimensionPage />} />
              <Route path="qa" element={<QADimensionPage />} />
              <Route path="gut" element={<GutDimensionPage />} />
              {/* Otras pestañas se podrán agregar luego */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);