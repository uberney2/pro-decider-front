// src/types/QAData.ts
export interface QAData {
    currentStatus: string;
    testTools: string;
    automationLevel: string;
    manualProcess: boolean;
    automatedProcess: boolean;
    observations: string;
    status: string; // "Good", "Warning", "Bad" o "Not Defined"
  }
  