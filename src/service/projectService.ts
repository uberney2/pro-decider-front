import { Project, DimensionStatus } from "../types/Project";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch("http://localhost:8080/api/project");
  if (!response.ok) {
    throw new Error("Error fetching projects");
  }
  return response.json();
}

export async function getDimensionStatus(
    projectId: string,
    dimension: "plan" | "team" | "process" | "qa" | "gut"
  ): Promise<DimensionStatus> {
    try {
      const response = await fetch(`/api/project/${projectId}/${dimension}`);
      // Si la respuesta no es ok, retorna "Not Defined"
      if (!response.ok) {
        return "Not Defined";
      }
      const contentType = response.headers.get("content-type");
      // Si el content-type no incluye JSON, asumimos que no hay data
      if (!contentType || !contentType.includes("application/json")) {
        return "Not Defined";
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${dimension} for project ${projectId}:`, error);
      return "Not Defined";
    }
  }