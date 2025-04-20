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
import { getProjects, updateProject } from "../../service/projectService";
import { Project, ProjectStatus } from "../../types/Project";
import { DroppableColumn } from "./DroppableColumn";
import PursuitCard from "../../components/PursuitCard/PursuitCard";

const KANBAN_STATUSES: ProjectStatus[] = [
  ProjectStatus.OPEN,
  ProjectStatus.PRE_ANALYSIS,
  ProjectStatus.ENGINEERING_REVIEW,
  ProjectStatus.IN_VALIDATION,
  ProjectStatus.CANCELLED,
];

const PursuitsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Carga inicial de proyectos
  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        const filtered = data.filter((p) =>
          KANBAN_STATUSES.includes(p.status.trim() as ProjectStatus)
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    })();
  }, []);

  // Filtros de búsqueda
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesName = p.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesBuOwner = p.account.buOwner.name
        .toLowerCase()
        .includes(searchBuOwner.toLowerCase());
      return matchesName && matchesBuOwner;
    });
  }, [projects, searchName, searchBuOwner]);

  // Organiza los proyectos por columna
  const columnsData = useMemo(() => {
    const result: Record<string, Project[]> = {};
    KANBAN_STATUSES.forEach((status) => {
      result[status] = [];
    });
    filteredProjects.forEach((p) => {
      const norm = p.status.trim();
      if (!(norm in result)) {
        result[ProjectStatus.OPEN].push(p);
      } else {
        result[norm].push(p);
      }
    });
    return result;
  }, [filteredProjects]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    // 1) Encuentra el proyecto que se está arrastrando
    const activeProject = projects.find((p) => p.id === active.id);
    if (!activeProject) return;

    // 2) Determinar nuevo status
    const overId = (over.id as string).trim();
    let newStatus: ProjectStatus;

    if (KANBAN_STATUSES.includes(overId as ProjectStatus)) {
      // Caso: soltado sobre el "riel" (columna)
      newStatus = overId as ProjectStatus;
    } else {
      // Caso: soltado sobre otra tarjeta -> busco su proyecto y tomo su status
      const overProject = projects.find((p) => p.id === overId);
      if (!overProject) return;
      newStatus = overProject.status.trim() as ProjectStatus;
    }

    // 3) Si cambia el status, actualizo UI y llamo al backend
    if (activeProject.status.trim() !== newStatus) {
      const updatedProject = { ...activeProject, status: newStatus };
      setProjects((prev) =>
        prev.map((p) => (p.id === active.id ? updatedProject : p))
      );
      try {
        await updateProject(updatedProject);
      } catch (err: any) {
        console.error("Error updating project status:", err);
      }
    }
  };

  const handleNewPursuit = () => {
    navigate("/pursuits/new");
  };

  const activeProject =
    projects.find((p) => p.id === activeId) || null;

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

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Contenedor principal del Kanban */}
        <div className={styles.boardCard}>
          <div className={styles.kanban}>
            {KANBAN_STATUSES.map((status) => (
              <DroppableColumn
                key={status}
                status={status}
                items={columnsData[status]}
              />
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
    </div>
  );
};

export default PursuitsPage;
