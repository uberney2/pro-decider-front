// src/service/projectService.ts
import { Project, DimensionStatus } from "../types/Project";
import { TeamDimension } from "../types/TeamDimension";
import { PlanDimension } from "../types/PlanDimension";
import { ProcessDimension } from "../types/ProcessDimension";
import { QADimension } from "../types/QADimension";
import { GutDimension } from "../types/GutDimension";

// Obtiene la lista de proyectos
export async function getProjects(): Promise<Project[]> {
  const response = await fetch("http://localhost:8080/api/project");
  if (!response.ok) {
    throw new Error("Error fetching projects");
  }
  return response.json();
}

// Obtiene un proyecto por su ID (detalles)
export async function getProjectById(projectId: string): Promise<Project> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}`);
  if (!response.ok) {
    throw new Error("Error fetching project details");
  }
  const data: Project = await response.json();
  return data;
}

// Actualiza un proyecto (detalles)
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
  return;
}

// Crea un proyecto (detalles)
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
  return;
}

// Obtiene el estado de una dimensión (usado en la tarjeta)
export async function getDimensionStatus(
  projectId: string,
  dimension: "plan" | "team" | "process" | "qa" | "gut"
): Promise<DimensionStatus> {
  try {
    const response = await fetch(`http://localhost:8080/api/project/${projectId}/${dimension}`);
    if (!response.ok) {
      return "Not Defined";
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return "Not Defined";
    }
    const data = await response.json();
    return data.status; // Se espera que el JSON tenga la propiedad "status"
  } catch (error) {
    console.error(`Error fetching ${dimension} for project ${projectId}:`, error);
    return "Not Defined";
  }
}

// ========================
// Funciones para crear dimensiones
// ========================

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

export async function createPlanDimension(projectId: string, plan: PlanDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });
  if (!response.ok) {
    throw new Error("Error creating plan dimension");
  }
  return;
}

export async function createProcessDimension(projectId: string, process: ProcessDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(process),
  });
  if (!response.ok) {
    throw new Error("Error creating process dimension");
  }
  return;
}

export async function createQADimension(projectId: string, qa: QADimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/qa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(qa),
  });
  if (!response.ok) {
    throw new Error("Error creating QA dimension");
  }
  return;
}

export async function createGutDimension(projectId: string, gut: GutDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/gut`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gut),
  });
  if (!response.ok) {
    throw new Error("Error creating gut dimension");
  }
  return;
}

// ========================
// Funciones para actualizar dimensiones
// ========================

export async function updateTeamDimension(projectId: string, teamId: string, team: TeamDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/team/${teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  });
  if (!response.ok) {
    throw new Error("Error updating team dimension");
  }
  return;
}

export async function updatePlanDimension(projectId: string, planId: string, plan: PlanDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/plan/${planId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });
  if (!response.ok) {
    throw new Error("Error updating plan dimension");
  }
  return;
}

export async function updateProcessDimension(projectId: string, processId: string, process: ProcessDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/process/${processId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(process),
  });
  if (!response.ok) {
    throw new Error("Error updating process dimension");
  }
  return;
}

export async function updateQADimension(projectId: string, qaId: string, qa: QADimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/qa/${qaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(qa),
  });
  if (!response.ok) {
    throw new Error("Error updating QA dimension");
  }
  return;
}

export async function updateGutDimension(projectId: string, gutId: string, gut: GutDimension): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/project/${projectId}/gut/${gutId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gut),
  });
  if (!response.ok) {
    throw new Error("Error updating gut dimension");
  }
  return;
}
