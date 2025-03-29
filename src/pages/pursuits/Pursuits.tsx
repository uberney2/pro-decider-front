import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PursuitsPage.module.css";

import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { Project, ProjectStatus } from "../../types/Project";
import { getProjects } from "../../service/projectService";

import { DroppableColumn } from "./DroppableColumn"; 

// Estados del Kanban
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

  const navigate = useNavigate();

  // Cargar proyectos al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        // Filtra solo los proyectos con un status dentro de KANBAN_STATUSES
        const filtered = data.filter((p) =>
          KANBAN_STATUSES.includes(p.status as ProjectStatus)
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    })();
  }, []);

  // Filtro por nombre y BU Owner
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

  // Agrupamos los proyectos por status
  const columnsData = useMemo(() => {
    const result: Record<string, Project[]> = {};
    KANBAN_STATUSES.forEach((status) => {
      result[status] = [];
    });
    filteredProjects.forEach((p) => {
      result[p.status].push(p);
    });
    return result;
  }, [filteredProjects]);

  // Manejar Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("active:", active.id, "over:", over?.id);

    if (!over || active.id === over.id) return;

    // Buscamos el proyecto arrastrado
    const activeProject = projects.find((p) => p.id === active.id);
    if (!activeProject) return;

    // over.id será el status (ej: "Open", "Preanalysis", etc.)
    const newStatus = over.id as ProjectStatus;
    if (activeProject.status !== newStatus) {
      const updatedProject = { ...activeProject, status: newStatus };
      // Actualiza en el estado local
      setProjects((prev) =>
        prev.map((p) => (p.id === active.id ? updatedProject : p))
      );
      // Aquí podrías hacer un PUT al backend para persistir el cambio de status
    }
  };

  const handleNewPursuit = () => {
    console.log("New Pursuit clicked");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Pursuits</h1>
        <button className={styles.newPursuitButton} onClick={handleNewPursuit}>
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

      <DndContext onDragEnd={handleDragEnd}>
        <div className={styles.kanban}>
          {KANBAN_STATUSES.map((status) => {
            const items = columnsData[status];
            return (
              <DroppableColumn
                key={status}
                status={status}
                items={items}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default PursuitsPage;