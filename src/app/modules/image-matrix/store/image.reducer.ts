import { createFeature, createReducer, on } from '@ngrx/store';
import { ImageActions } from './image.actions';
import { ImageTask } from '../types/image-task.type';

export interface ImageState {
  tasks: ImageTask[];
}

const initialState: ImageState = { tasks: [] };

export const imageMatrixFeature = createFeature({
  name: 'imageMatrix',
  reducer: createReducer(
    initialState,
    on(ImageActions.addTask, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, task]
    })),
    on(ImageActions.updateTaskStatus, (state, { id, status, outputBlobUrl, error }) => ({
      ...state,
      tasks: state.tasks.map(t =>
        t.id === id ? { ...t, status: status as ImageTask['status'], outputBlobUrl, error } : t
      )
    })),
    on(ImageActions.removeTask, (state, { id }) => ({
      ...state,
      tasks: state.tasks.filter(t => t.id !== id)
    })),
    on(ImageActions.clearAll, (state) => ({ ...state, tasks: [] }))
  )
});
