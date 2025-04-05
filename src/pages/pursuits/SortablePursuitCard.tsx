// src/pages/SortablePursuitCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "../../types/Project";
import PursuitCard from "../../components/PursuitCard/PursuitCard";

interface Props {
  project: Project;
}

export const SortablePursuitCard: React.FC<Props> = ({ project }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transform ? "transform 300ms ease" : undefined,
  };

  // Función para manejar el clic de edición.
  // Puedes implementar la lógica que necesites (navegar a una vista de edición, etc.)
  const handleEdit = (projectId: string) => {
    console.log("Edit project", projectId);
    // Por ejemplo: navigate(`/pursuits/edit/${projectId}`);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PursuitCard project={project} onEdit={handleEdit} />
    </div>
  );
};
