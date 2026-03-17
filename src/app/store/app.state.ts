import { ActionReducerMap } from '@ngrx/store';
import { appReducer } from './app.reducer';

export interface Task {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
}

export interface AppState {
  sidebar: {
    collapsed: boolean;
    activeRoute: string;
  };
  system: {
    ffmpegLoaded: boolean;
    onnxLoaded: boolean;
    opfsAvailable: boolean;
    networkStatus: 'online' | 'offline';
    memoryUsage: number;
  };
  tasks: {
    active: Task[];
    history: Task[];
    totalCompleted: number;
  };
}

export interface RootState {
  app: AppState;
}

export const reducers: ActionReducerMap<RootState> = {
  app: appReducer
};
