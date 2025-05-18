import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SortableWidget: React.FC<SortableWidgetProps> = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-manipulation',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};