import {
  createAction,
  props
} from "./chunk-KGVNL5XR.js";

// src/app/store/app.actions.ts
var toggleSidebar = createAction("[Shell] Toggle Sidebar");
var setSidebarCollapsed = createAction("[Shell] Set Sidebar Collapsed", props());
var setActiveRoute = createAction("[Router] Set Active Route", props());
var setNetworkStatus = createAction("[System] Set Network Status", props());
var setFfmpegLoaded = createAction("[System] Set FFmpeg Loaded", props());
var setOnnxLoaded = createAction("[System] Set ONNX Loaded", props());
var setOpfsAvailable = createAction("[System] Set OPFS Available", props());
var updateMemoryUsage = createAction("[System] Update Memory Usage", props());
var addTask = createAction("[Task] Add Task", props());
var updateTaskProgress = createAction("[Task] Update Task Progress", props());
var completeTask = createAction("[Task] Complete Task", props());
var failTask = createAction("[Task] Fail Task", props());

export {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveRoute,
  setNetworkStatus,
  setFfmpegLoaded,
  setOnnxLoaded,
  setOpfsAvailable,
  updateMemoryUsage,
  addTask,
  updateTaskProgress,
  completeTask,
  failTask
};
//# sourceMappingURL=chunk-ILRANHO7.js.map
