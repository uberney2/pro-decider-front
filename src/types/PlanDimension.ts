export interface PlanDimension {
    id: string;
    backlogResponsible: string;
    roadMap: string;
    deliverables: string;
    status: "Good" | "Warning" | "Bad" | "Not Defined";
    observations: string;
  }
  