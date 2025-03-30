// src/pages/SortablePursuitCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "../../types/Project";
import { PursuitCard } from "../../components/PursuitCard/PursuitCard";

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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PursuitCard project={project} />
    </div>
  );
};
