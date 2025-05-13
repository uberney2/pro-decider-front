// src/pages/pursuits/PursuitsPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PursuitsPage.module.css";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  getProjects,
  updateProject,
  getDimensionStatus,
} from "../../service/projectService";
import { Project, ProjectStatus } from "../../types/Project";
import { DroppableColumn } from "./DroppableColumn";
import PursuitCard from "../../components/PursuitCard/PursuitCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KANBAN_STATUSES: ProjectStatus[] = [
  ProjectStatus.OPEN,
  ProjectStatus.PRE_ANALYSIS,
  ProjectStatus.ENGINEERING_REVIEW,
  ProjectStatus.IN_VALIDATION,
  ProjectStatus.EXECUTION,
  ProjectStatus.CANCELLED,
];

type DimName = "team" | "plan" | "process" | "qa" | "gut";
const dimOrder: DimName[] = ["team", "plan", "process", "qa", "gut"];

export const PursuitsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // state para el modal de confirmación de cancelación
  const [confirmCancelProject, setConfirmCancelProject] = useState<Project | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        const filtered = data.filter((p) =>
          KANBAN_STATUSES.includes(p.status.trim() as ProjectStatus)
        );
        setProjects(filtered);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        toast.error("Error loading pursuits: " + err.message);
      }
    })();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchName.toLowerCase()) &&
        p.account.buOwner.name
          .toLowerCase()
          .includes(searchBuOwner.toLowerCase())
      );
    });
  }, [projects, searchName, searchBuOwner]);

  const columnsData = useMemo(() => {
    const result: Record<ProjectStatus, Project[]> = {
      [ProjectStatus.OPEN]: [],
      [ProjectStatus.PRE_ANALYSIS]: [],
      [ProjectStatus.ENGINEERING_REVIEW]: [],
      [ProjectStatus.IN_VALIDATION]: [],
      [ProjectStatus.EXECUTION]: [],
      [ProjectStatus.CANCELLED]: [],
    };
    filteredProjects.forEach((p) => {
      const s = p.status.trim() as ProjectStatus;
      (result[s] ?? result[ProjectStatus.OPEN]).push(p);
    });
    return result;
  }, [filteredProjects]);

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);

  const fetchAllDimensionStatuses = async (projectId: string) =>
    Promise.all(dimOrder.map((d) => getDimensionStatus(projectId, d)));

  const someBad = (s: string[]) => s.includes("Bad");
  const noneBad = (s: string[]) => !someBad(s);

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const activeProject = projects.find((p) => p.id === active.id);
    if (!activeProject) return;

    let newStatus: ProjectStatus;
    const overId = (over.id as string).trim();

    if (KANBAN_STATUSES.includes(overId as ProjectStatus)) {
      newStatus = overId as ProjectStatus;
    } else {
      const overProject = projects.find((p) => p.id === overId);
      if (!overProject) return;
      newStatus = overProject.status.trim() as ProjectStatus;
    }
    if (activeProject.status.trim() === newStatus) return;

    /* ------- business rules ------- */
    let allowed = true;
    if (
      newStatus === ProjectStatus.EXECUTION ||
      newStatus === ProjectStatus.CANCELLED
    ) {
      try {
        const dims = await fetchAllDimensionStatuses(activeProject.id);

        if (newStatus === ProjectStatus.EXECUTION && someBad(dims)) {
          allowed = false;
          toast.info("Cannot move to EXECUTION: at least one dimension is Bad.");
        }

        if (newStatus === ProjectStatus.CANCELLED) {
          if (noneBad(dims)) {
            // en lugar de bloquear, pedimos confirmación
            setConfirmCancelProject(activeProject);
            return;
          }
          // si hay algún Bad, dejamos avanzar sin confirmación
        }
      } catch (err) {
        console.error("Error validating dimensions:", err);
        allowed = false;
        toast.error("Could not validate dimensions. Please try again later.");
      }
    }
    if (!allowed) return;

    /* ------- update project ------- */
    const updated = { ...activeProject, status: newStatus };
    setProjects((prev) =>
      prev.map((p) => (p.id === active.id ? updated : p))
    );
    try {
      await updateProject(updated);
    } catch (err: any) {
      console.error("Error updating project:", err);
      toast.error("Error updating project: " + err.message);
    }
  };

  const handleConfirmCancel = async () => {
    if (!confirmCancelProject) return;
    const updated = { ...confirmCancelProject, status: ProjectStatus.CANCELLED };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === updated.id ? updated : p
      )
    );
    try {
      await updateProject(updated);
    } catch (err: any) {
      console.error("Error cancelling project:", err);
      toast.error("Error cancelling project: " + err.message);
    }
    setConfirmCancelProject(null);
  };

  const handleAbortCancel = () => {
    setConfirmCancelProject(null);
  };

  const handleNewPursuit = () => navigate("/pursuits/new");
  const activeProject = projects.find((p) => p.id === activeId) || null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Pursuits</h1>
        <button
          className={styles.newPursuitButton}
          onClick={handleNewPursuit}
        >
          New Pursuit
        </button>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label>Search Pursuit</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Type Pursuit"
          />
        </div>
        <div className={styles.filterItem}>
          <label>BU Owner</label>
          <input
            type="text"
            value={searchBuOwner}
            onChange={(e) => setSearchBuOwner(e.target.value)}
            placeholder="Filter by BU Owner"
          />
        </div>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.boardCard}>
          <div className={styles.kanban}>
            {KANBAN_STATUSES.map((s) => (
              <DroppableColumn key={s} status={s} items={columnsData[s]} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeProject && (
            <div className={styles.dragOverlay}>
              <PursuitCard
                project={activeProject}
                onEdit={(id) => navigate(`/pursuits/edit/${id}`)}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal de confirmación de cancelación */}
      {confirmCancelProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Cancellation</h2>
            <p>
              This pursuit has no dimensions in red. Are you sure you want to cancel it?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmCancel}
              >
                Yes, Cancel
              </button>
              <button
                className={styles.modalCancelButton}
                onClick={handleAbortCancel}
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PursuitsPage;
