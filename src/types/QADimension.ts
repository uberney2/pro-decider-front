// src/types/QADimension.ts
export interface QADimension {
    id: string;
    currentStatus: string;  
    testTools: string;             
    automationLevel: string;       
    manualProcess: boolean;        
    automatedProcess: boolean;     
    observations: string;          
    status: "Good" | "Warning" | "Bad" | "Not Defined";
  }
  