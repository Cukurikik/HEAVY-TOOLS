import {
  createFeatureSelector,
  createSelector
} from "./chunk-KGVNL5XR.js";

// src/app/store/app.selectors.ts
var selectAppState = createFeatureSelector("app");
var selectSidebar = createSelector(selectAppState, (state) => state.sidebar);
var selectSidebarCollapsed = createSelector(selectSidebar, (sidebar) => sidebar.collapsed);
var selectActiveRoute = createSelector(selectSidebar, (sidebar) => sidebar.activeRoute);
var selectSystem = createSelector(selectAppState, (state) => state.system);
var selectNetworkStatus = createSelector(selectSystem, (system) => system.networkStatus);
var selectMemoryUsage = createSelector(selectSystem, (system) => system.memoryUsage);
var selectTasks = createSelector(selectAppState, (state) => state.tasks);
var selectActiveTasks = createSelector(selectTasks, (tasks) => tasks.active);
var selectTaskHistory = createSelector(selectTasks, (tasks) => tasks.history);
var selectTotalCompletedTasks = createSelector(selectTasks, (tasks) => tasks.totalCompleted);

export {
  selectSidebarCollapsed,
  selectActiveRoute,
  selectSystem,
  selectTasks
};
//# sourceMappingURL=chunk-34ZIAKJW.js.map
