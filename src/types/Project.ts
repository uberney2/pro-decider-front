import { Account } from "./Account";

export interface Project {
    id: string;
    account: Account;
    name: string;
    fullTimeEmployees?: string;
    averageBillingRate?: string;
    totalHours?: string;
    closingProbability?: string;
    latamRevenue?: string;
    latamParticipationPercentage?: string;
    activeEmployees?: string;
    gmPercentage?: string;
    totalSOW?: string;
    contractType?: string;
    usaPointOfContact?: string;
    pursuitStartDate?: string;
    pursuitEndDate?: string;
    statusChangeDate?: string;
    responsibleFromLatam?: string[];
    status: string;
    additionalBackground?: string;
    onboardingProcess?: string;
    servicesScope?: string;
    levelOfAccount?: string;
    updatedAt?: string;
  }
  
  
  export enum ProjectStatus {
    OPEN = "Open",
    PRE_ANALYSIS = "Preanalysis",
    ENGINEERING_REVIEW = "Engineering Review",
    IN_VALIDATION = "In Validation",
    CANCELLED = "Cancelled",
    EXECUTION = 'Execution'
  }

  export type DimensionStatus = "Good" | "Warning" | "Bad" | "Not Defined";