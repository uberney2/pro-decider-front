export interface TeamDimension {
    id: string;
    composition: string;
    teamConfiguration: string;
    englishLevel: string;
    observations: string;
    deployDate: string;
    status: "Good" | "Warning" | "Bad" | "Not Defined";
  }