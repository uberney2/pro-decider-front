import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PursuitsPage.module.css";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Project, ProjectStatus } from "../../types/Project";
import { getProjects, updateProject } from "../../service/projectService";
import { DroppableColumn } from "./DroppableColumn"; // Componente de columna (ver ejemplo anterior)
import { PursuitCard } from "../../components/PursuitCard/PursuitCard";

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

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        // Filtramos solo los proyectos cuyo estado esté en nuestro Kanban
        const filtered = data.filter((p) =>
          KANBAN_STATUSES.includes(p.status as ProjectStatus)
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    })();
  }, []);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("active:", active.id, "over:", over?.id);
    setActiveId(null); // Si estás usando activeId para el overlay
  
    if (!over || active.id === over.id) return;
  
    // Buscar el proyecto arrastrado
    const activeProject = projects.find((p) => p.id === active.id);
    if (!activeProject) return;
  
    // over.id es el ID del contenedor droppable, que definimos como el status
    const newStatus = over.id as Project["status"];
    if (activeProject.status !== newStatus) {
      const updatedProject = { ...activeProject, status: newStatus };
      // Actualizar el estado local
      setProjects((prev) =>
        prev.map((p) => (p.id === active.id ? updatedProject : p))
      );
  
      // Actualizar el backend
      try {
        await updateProject(updatedProject);
      } catch (error: any) {
        console.error("Error updating project status:", error);
        // Aquí podrías revertir el cambio local o notificar al usuario
      }
    }
  };

  const handleNewPursuit = () => {
    console.log("New Pursuit clicked");
  };

  // Renderizamos el overlay: buscamos el proyecto activo y lo renderizamos
  const activeProject = projects.find((p) => p.id === activeId) || null;

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

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.kanban}>
          {KANBAN_STATUSES.map((status) => {
            const items = columnsData[status];
            return (
              <DroppableColumn key={status} status={status} items={items} />
            );
          })}
        </div>
        <DragOverlay>
          {activeProject ? <PursuitCard project={activeProject} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default PursuitsPage;
