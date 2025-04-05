// src/pages/SortablePursuitCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "../../types/Project";
import PursuitCard from "../../components/PursuitCard/PursuitCard";
import { useNavigate } from "react-router-dom";
import styles from "./SortablePursuitCard.module.css";

interface Props {
  project: Project;
}

const SortablePursuitCard: React.FC<Props> = ({ project }) => {
  // Usamos useSortable para habilitar el drag, pero aplicaremos los listeners solo en el "handle"
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: project.id });
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transform ? "transform 300ms ease" : undefined,
    position: "relative",
  };

  // Callback para navegar a la edición
  const handleEdit = (projectId: string) => {
    navigate(`/pursuits/edit/${projectId}`, { state: { projectId } });
  };

  return (
    <div ref={setNodeRef} style={containerStyle} className={styles.container}>
      {/* Contenido de la tarjeta sin listeners de drag */}
      <div className={styles.cardContent}>
        <PursuitCard project={project} onEdit={handleEdit} />
      </div>
      {/* Drag handle: solo esta área tiene los listeners para arrastrar */}
      <div className={styles.dragHandle} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </div>
    </div>
  );
};

export default SortablePursuitCard;
