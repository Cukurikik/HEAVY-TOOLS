import { createAction, props } from '@ngrx/store';
import { Task } from './app.state';

// Sidebar
export const toggleSidebar = createAction('[Shell] Toggle Sidebar');
export const setSidebarCollapsed = createAction('[Shell] Set Sidebar Collapsed', props<{ collapsed: boolean }>());
export const setActiveRoute = createAction('[Router] Set Active Route', props<{ route: string }>());

// System
export const setNetworkStatus = createAction('[System] Set Network Status', props<{ status: 'online' | 'offline' }>());
export const setFfmpegLoaded = createAction('[System] Set FFmpeg Loaded', props<{ loaded: boolean }>());
export const setOnnxLoaded = createAction('[System] Set ONNX Loaded', props<{ loaded: boolean }>());
export const setOpfsAvailable = createAction('[System] Set OPFS Available', props<{ available: boolean }>());
export const updateMemoryUsage = createAction('[System] Update Memory Usage', props<{ usage: number }>());

// Tasks
export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTaskProgress = createAction('[Task] Update Task Progress', props<{ id: string; progress: number }>());
export const completeTask = createAction('[Task] Complete Task', props<{ id: string }>());
export const failTask = createAction('[Task] Fail Task', props<{ id: string }>());
