// src/pages/pursuits/create-pursuit/NewPursuitPageContainer.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./NewPursuitPage.module.css";
import { DetailsData } from "../../../types/DetailsData";
import { TeamData } from "../../../types/TeamData";
import { PlanData } from "../../../types/PlanData";
import { ProcessData } from "../../../types/ProcessData";
import { QAData } from "../../../types/QAData";
import { GutDimension } from "../../../types/GutDimension";

export interface OutletContextProps {
  projectId: string | null;
  setProjectId: (id: string) => void;
  detailsData: DetailsData;
  setDetailsData: React.Dispatch<React.SetStateAction<DetailsData>>;
  teamData: TeamData;
  setTeamData: React.Dispatch<React.SetStateAction<TeamData>>;
  planData: PlanData;
  setPlanData: React.Dispatch<React.SetStateAction<PlanData>>;
  processData: ProcessData;
  setProcessData: React.Dispatch<React.SetStateAction<ProcessData>>;
  qaData: QAData;
  setQaData: React.Dispatch<React.SetStateAction<QAData>>;
  gutData: GutDimension;
  setGutData: React.Dispatch<React.SetStateAction<GutDimension>>;
}

const NewPursuitPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projectId, setProjectId] = useState<string | null>(null);

  // Estado para Details
  const [detailsData, setDetailsData] = useState<DetailsData>({
    pursuitName: "",
    gmPercentage: "",
    totalSOW: "",
    primarySalesBU: "",
    accountId: "",
    accountName: "",
    buOwnerId: "",
    buOwnerName: "",
    contractType: "",
    usaPointOfContact: "",
    pursuitStartDate: "",
    pursuitEndDate: "",
    additionalBackground: "",
    onboardingProcess: "",
    servicesScope: "",
    levelOfAccount: "",
    fullTimeEmployees: "",
    averageBillingRate: "",
    totalHours: "",
    responsibleFromLatam: "",
    pursuitKind: "",
    status: "",
  });

  // Estado para Team
  const [teamData, setTeamData] = useState<TeamData>({
    composition: "",
    teamConfiguration: "",
    englishLevel: "",
    deployDate: "",
    status: "Not Defined",
    observations: "",
  });

  // Estado para Plan
  const [planData, setPlanData] = useState<PlanData>({
    backlogResponsible: "",
    roadMap: "",
    deliverables: "",
    status: "Not Defined",
    observations: "",
  });

  // Estado para Process
  const [processData, setProcessData] = useState<ProcessData>({
    stack: "",
    methodology: "",
    frequencyToDeploy: "",
    latamInfluence: "",
    accountabilityLevel: "",
    observations: "",
    status: "Not Defined",
  });

  // Estado para QA
  const [qaData, setQaData] = useState<QAData>({
    currentStatus: "",
    testTools: "",
    automationLevel: "",
    manualProcess: false,
    automatedProcess: false,
    observations: "",
    status: "Not Defined",
  });

  // Estado para Gut
  const [gutData, setGutData] = useState<GutDimension>({
    id: "",
    observations: "",
    status: "Not Defined",
  });

  useEffect(() => {
    const st = location.state as { projectId?: string } | undefined;
    if (st?.projectId && !projectId) {
      setProjectId(st.projectId);
    }
  }, [location.state, projectId]);

  // Mostrar las pestañas solo si existe projectId (es decir, después de guardar Details)
  const showTabs = !!projectId;

  const pathParts = location.pathname.split("/");
  const currentTab = pathParts[pathParts.length - 1] || "details";

  const handleTabClick = (tab: string) => {
    if (!showTabs) {
      navigate("/pursuits/new/details", { replace: true });
      return;
    }
    navigate(`/pursuits/new/${tab}`, { state: { projectId } });
  };

  return (
    <div className={styles.container}>
      {showTabs && (
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${currentTab === "details" && styles.activeTab}`}
            onClick={() => handleTabClick("details")}>
            Details
          </button>
          <button className={`${styles.tab} ${currentTab === "team" && styles.activeTab}`}
            onClick={() => handleTabClick("team")}>
            Team
          </button>
          <button className={`${styles.tab} ${currentTab === "plan" && styles.activeTab}`}
            onClick={() => handleTabClick("plan")}>
            Plan
          </button>
          <button className={`${styles.tab} ${currentTab === "process" && styles.activeTab}`}
            onClick={() => handleTabClick("process")}>
            Process
          </button>
          <button className={`${styles.tab} ${currentTab === "qa" && styles.activeTab}`}
            onClick={() => handleTabClick("qa")}>
            QA
          </button>
          <button className={`${styles.tab} ${currentTab === "gut" && styles.activeTab}`}
            onClick={() => handleTabClick("gut")}>
            Gut
          </button>
        </div>
      )}
      <Outlet
        context={{
          projectId,
          setProjectId,
          detailsData,
          setDetailsData,
          teamData,
          setTeamData,
          planData,
          setPlanData,
          processData,
          setProcessData,
          qaData,
          setQaData,
          gutData,
          setGutData,
        }}
      />
    </div>
  );
};

export default NewPursuitPageContainer;
