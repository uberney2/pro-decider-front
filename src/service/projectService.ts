import { Project, DimensionStatus } from "../types/Project";
import { TeamDimension } from "../types/TeamDimension";

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
      const response = await fetch(`http://localhost:8080/api/project/${projectId}/${dimension}`);
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
      return data.status;
    } catch (error) {
      console.error(`Error fetching ${dimension} for project ${projectId}:`, error);
      return "Not Defined";
    }
  }

  export async function updateProject(project: Project): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/project/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
  
    if (!response.ok) {
      throw new Error("Error updating project");
    }
    // Si no hay cuerpo en la respuesta, simplemente retornamos.
    return;
  }

  export async function createProject(project: Project): Promise<void> {
    const response = await fetch("http://localhost:8080/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
  
    if (!response.ok) {
      throw new Error("Error creating project");
    }
    // Si el backend no retorna nada, no llamamos a response.json()
    return;
  }

  //=====================================Dimension secction=============================================================

  export async function createTeamDimension(projectId: string, team: TeamDimension): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/project/${projectId}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
  
    if (!response.ok) {
      throw new Error("Error creating team dimension");
    }
    return;
  }