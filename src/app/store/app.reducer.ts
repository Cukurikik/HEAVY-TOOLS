import { createReducer, on } from '@ngrx/store';
import { AppState } from './app.state';
import * as AppActions from './app.actions';

export const initialState: AppState = {
  sidebar: {
    collapsed: false,
    activeRoute: '/'
  },
  system: {
    ffmpegLoaded: false,
    onnxLoaded: false,
    opfsAvailable: true,
    networkStatus: 'online',
    memoryUsage: 0
  },
  tasks: {
    active: [],
    history: [],
    totalCompleted: 0
  }
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.toggleSidebar, state => ({
    ...state,
    sidebar: {
      ...state.sidebar,
      collapsed: !state.sidebar.collapsed
    }
  })),
  on(AppActions.setSidebarCollapsed, (state, { collapsed }) => ({
    ...state,
    sidebar: {
      ...state.sidebar,
      collapsed
    }
  })),
  on(AppActions.setActiveRoute, (state, { route }) => ({
    ...state,
    sidebar: {
      ...state.sidebar,
      activeRoute: route
    }
  })),
  on(AppActions.setNetworkStatus, (state, { status }) => ({
    ...state,
    system: {
      ...state.system,
      networkStatus: status
    }
  })),
  on(AppActions.setFfmpegLoaded, (state, { loaded }) => ({
    ...state,
    system: {
      ...state.system,
      ffmpegLoaded: loaded
    }
  })),
  on(AppActions.setOnnxLoaded, (state, { loaded }) => ({
    ...state,
    system: {
      ...state.system,
      onnxLoaded: loaded
    }
  })),
  on(AppActions.setOpfsAvailable, (state, { available }) => ({
    ...state,
    system: {
      ...state.system,
      opfsAvailable: available
    }
  })),
  on(AppActions.updateMemoryUsage, (state, { usage }) => ({
    ...state,
    system: {
      ...state.system,
      memoryUsage: usage
    }
  })),
  on(AppActions.addTask, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      active: [...state.tasks.active, task]
    }
  })),
  on(AppActions.updateTaskProgress, (state, { id, progress }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      active: state.tasks.active.map(t => t.id === id ? { ...t, progress } : t)
    }
  })),
  on(AppActions.completeTask, (state, { id }) => {
    const task = state.tasks.active.find(t => t.id === id);
    if (!task) return state;
    const completedTask = { ...task, status: 'success' as const, progress: 100 };
    return {
      ...state,
      tasks: {
        active: state.tasks.active.filter(t => t.id !== id),
        history: [completedTask, ...state.tasks.history],
        totalCompleted: state.tasks.totalCompleted + 1
      }
    };
  }),
  on(AppActions.failTask, (state, { id }) => {
    const task = state.tasks.active.find(t => t.id === id);
    if (!task) return state;
    const failedTask = { ...task, status: 'error' as const };
    return {
      ...state,
      tasks: {
        active: state.tasks.active.filter(t => t.id !== id),
        history: [failedTask, ...state.tasks.history],
        totalCompleted: state.tasks.totalCompleted
      }
    };
  })
);
