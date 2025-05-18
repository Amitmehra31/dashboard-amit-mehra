import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useWidgets } from '../../hooks/useWidgets';
import { WidgetType } from '../../types';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableWidget } from './SortableWidget';
import { Card } from '../ui/Card';

const WeatherWidget = lazy(() => import('./WeatherWidget').then(module => ({ default: module.WeatherWidget })));
const CryptoWidget = lazy(() => import('./CryptoWidget').then(module => ({ default: module.CryptoWidget })));
const TasksWidget = lazy(() => import('./TasksWidget').then(module => ({ default: module.TasksWidget })));

export const WidgetGrid: React.FC = () => {
  const { widgets, updatePositions } = useWidgets();
  const location = useLocation();
  
 
  const routeWidgets = widgets.filter(widget => widget.route === location.pathname)
    .sort((a, b) => a.position - b.position);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = routeWidgets.findIndex((widget) => widget.id === active.id);
      const newIndex = routeWidgets.findIndex((widget) => widget.id === over.id);
      
      const newWidgets = arrayMove(routeWidgets, oldIndex, newIndex).map((widget, index) => ({
        ...widget,
        position: index,
      }));
      
      const otherWidgets = widgets.filter(widget => widget.route !== location.pathname);
      updatePositions([...newWidgets, ...otherWidgets]);
    }
  };

  const WidgetPlaceholder = () => (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const renderWidget = (type: WidgetType, id: string, title: string, size: 'sm' | 'md' | 'lg') => {
    return (
      <Suspense fallback={<WidgetPlaceholder />}>
        {type === WidgetType.WEATHER && (
          <WeatherWidget id={id} title={title} size={size} />
        )}
        {type === WidgetType.CRYPTO && (
          <CryptoWidget id={id} title={title} size={size} />
        )}
        {type === WidgetType.TASKS && (
          <TasksWidget id={id} title={title} size={size} />
        )}
      </Suspense>
    );
  };

  return (
    <div className="space-y-6">
      {routeWidgets.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="mb-2 text-lg font-medium text-theme-primary">No widgets yet</h3>
          <p className="mb-4 text-theme-secondary">
            Add your first widget to get started with your dashboard.
          </p>
        </Card>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={routeWidgets.map(widget => widget.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {routeWidgets.map((widget) => (
                <SortableWidget key={widget.id} id={widget.id} className={
                  widget.size === 'lg' ? 'md:col-span-2 lg:col-span-3' : 
                  widget.size === 'md' ? 'lg:col-span-2' : ''
                }>
                  {renderWidget(widget.type, widget.id, widget.title, widget.size)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};