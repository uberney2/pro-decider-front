import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Project, ProjectStatus } from "../../types/Project";
import styles from "./PursuitsPage.module.css";
import { SortablePursuitCard } from "./SortablePursuitCard";

interface DroppableColumnProps {
  status: ProjectStatus;
  items: Project[];
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({
  status,
  items,
}) => {
  // useDroppable define el área que recibirá el drop
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h2 className={styles.columnTitle}>
        {status} ({items.length})
      </h2>
      <div className={styles.columnBody}>
        {/* SortableContext agrupa las tarjetas (sortables) dentro de la columna */}
        <SortableContext
          items={items.map((i) => i.id)}
          id={status}
          strategy={verticalListSortingStrategy}
        >
          {items.map((proj) => (
            <SortablePursuitCard key={proj.id} project={proj} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};