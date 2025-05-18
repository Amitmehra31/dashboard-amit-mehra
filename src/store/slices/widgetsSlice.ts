import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Widget, WidgetState, WidgetType } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const getInitialWidgets = (): Widget[] => {
  const savedWidgets = localStorage.getItem('widgets');
  if (savedWidgets) {
    try {
      const parsedWidgets = JSON.parse(savedWidgets);
      if (Array.isArray(parsedWidgets) && parsedWidgets.every(widget => 
        widget.id && 
        widget.type && 
        widget.title && 
        widget.size && 
        typeof widget.position === 'number' &&
        widget.route
      )) {
        return parsedWidgets;
      }
    } catch (e) {
      console.error('Error parsing saved widgets:', e);
    }
  }
  
  return [
    {
      id: uuidv4(),
      type: WidgetType.WEATHER,
      title: 'Weather',
      size: 'md',
      position: 0,
      route: '/dashboard'
    },
    {
      id: uuidv4(),
      type: WidgetType.CRYPTO,
      title: 'Crypto Prices',
      size: 'md',
      position: 1,
      route: '/dashboard'
    },
    {
      id: uuidv4(),
      type: WidgetType.TASKS,
      title: 'Tasks',
      size: 'lg',
      position: 2,
      route: '/dashboard'
    },
  ];
};

const saveWidgetsToStorage = (widgets: Widget[]) => {
  try {
    localStorage.setItem('widgets', JSON.stringify(widgets));
  } catch (e) {
    console.error('Error saving widgets to localStorage:', e);
  }
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState: {
    widgets: getInitialWidgets(),
    isLoading: false,
    error: null,
  } as WidgetState,
  reducers: {
    addWidget: (state, action: PayloadAction<{ type: WidgetType; title: string; size?: 'sm' | 'md' | 'lg'; route: string; position: number }>) => {
      const { type, title, size = 'md', route, position } = action.payload;
      
      const newWidget: Widget = {
        id: uuidv4(),
        type,
        title,
        size,
        position,
        route,
      };
      
      state.widgets.push(newWidget);
      saveWidgetsToStorage(state.widgets);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      const removedWidget = state.widgets.find(w => w.id === action.payload);
      if (removedWidget) {
        state.widgets = state.widgets.filter(w => w.id !== action.payload);
        
        state.widgets = state.widgets.map(widget => {
          if (widget.route === removedWidget.route && widget.position > removedWidget.position) {
            return { ...widget, position: widget.position - 1 };
          }
          return widget;
        });
        
        saveWidgetsToStorage(state.widgets);
      }
    },
    updateWidgetPositions: (state, action: PayloadAction<Widget[]>) => {
      state.widgets = action.payload;
      saveWidgetsToStorage(state.widgets);
    },
    updateWidgetSize: (state, action: PayloadAction<{ id: string; size: 'sm' | 'md' | 'lg' }>) => {
      const { id, size } = action.payload;
      const widget = state.widgets.find(w => w.id === id);
      if (widget) {
        widget.size = size;
        saveWidgetsToStorage(state.widgets);
      }
    },
    resetWidgets: (state) => {
      state.widgets = getInitialWidgets();
      saveWidgetsToStorage(state.widgets);
    },
  },
});

export const {
  addWidget,
  removeWidget,
  updateWidgetPositions,
  updateWidgetSize,
  resetWidgets,
} = widgetsSlice.actions;
export default widgetsSlice.reducer;