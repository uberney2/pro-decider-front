// src/types/ProcessDimension.ts
export interface ProcessDimension {
    id: string;
    stack: string;
    methodology: string;
    frequencyToDeploy: string;
    latamInfluence: string;
    accountabilityLevel: string;
    observations: string;
    status: "Good" | "Warning" | "Bad" | "Not Defined";
  }

  export enum AccountabilityLevelEnum {
    RESPONSIBLE_100 = 'Responsible 100%',
    BASED_ON_OUR_DEFINITION = 'Based on our definition',
    SHARED_RESPONSIBILITY = 'Shared Responsibility',
    BASED_ON_CLIENT = 'Based on Client',
    STAFF_AUMENTATION = 'Staff Aumentation',
  }
  