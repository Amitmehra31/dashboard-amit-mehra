import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  addWidget,
  removeWidget,
  updateWidgetPositions,
  updateWidgetSize,
  resetWidgets,
} from '../store/slices/widgetsSlice';
import { Widget, WidgetType } from '../types';

export const useWidgets = () => {
  const dispatch = useDispatch();
  const { widgets, isLoading, error } = useSelector(
    (state: RootState) => state.widgets
  );

  const add = ({ type, title, route }: { type: WidgetType; title: string; route: string }) => {
    const routeWidgets = widgets.filter(w => w.route === route);
    const position = routeWidgets.length;
    dispatch(addWidget({ type, title, route, position }));
  };

  const remove = (id: string) => {
    dispatch(removeWidget(id));
  };

  const updatePositions = (updatedWidgets: Widget[]) => {
    dispatch(updateWidgetPositions(updatedWidgets));
  };

  const updateSize = (id: string, size: 'sm' | 'md' | 'lg') => {
    dispatch(updateWidgetSize({ id, size }));
  };

  const reset = () => {
    dispatch(resetWidgets());
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);

  return {
    widgets: sortedWidgets,
    isLoading,
    error,
    add,
    remove,
    updatePositions,
    updateSize,
    reset,
  };
};