import { Account } from "./Account";

export interface Project {
    id: string;
    account: Account;
    name: string;
    gmPercentage?: string;
    totalSOW?: string;
    contractType?: string;
    usaPointOfContact?: string;
    pursuitStartDate?: string;
    pursuitEndDate?: string;
    statusChangeDate?: string;
    createdAt?: string;
    updatedAt?: string;
    responsibleFromLatam?: string[];
    status: ProjectStatus;
    additionalBackground?: string | null;
    onboardingProcess?: string | null;
    servicesScope?: string | null;
    levelOfAccount?: string | null;
  }
  
  
  export enum ProjectStatus {
    OPEN = "Open",
    PRE_ANALYSIS = "Preanalysis",
    ENGINEERING_REVIEW = "Engineering Review",
    IN_VALIDATION = "In Validation",
    CANCELLED = "Cancelled",
  }

  export type DimensionStatus = "Good" | "Warning" | "Bad" | "Not Defined";