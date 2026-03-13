import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectSidebar = createSelector(
  selectAppState,
  (state: AppState) => state.sidebar
);

export const selectSidebarCollapsed = createSelector(
  selectSidebar,
  sidebar => sidebar.collapsed
);

export const selectActiveRoute = createSelector(
  selectSidebar,
  sidebar => sidebar.activeRoute
);

export const selectSystem = createSelector(
  selectAppState,
  (state: AppState) => state.system
);

export const selectNetworkStatus = createSelector(
  selectSystem,
  system => system.networkStatus
);

export const selectMemoryUsage = createSelector(
  selectSystem,
  system => system.memoryUsage
);

export const selectTasks = createSelector(
  selectAppState,
  (state: AppState) => state.tasks
);

export const selectActiveTasks = createSelector(
  selectTasks,
  tasks => tasks.active
);

export const selectTaskHistory = createSelector(
  selectTasks,
  tasks => tasks.history
);

export const selectTotalCompletedTasks = createSelector(
  selectTasks,
  tasks => tasks.totalCompleted
);
