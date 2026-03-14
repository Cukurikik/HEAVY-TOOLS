import { createSelector } from '@ngrx/store';
import { imageMatrixFeature } from './image.reducer';

export const selectImageState = imageMatrixFeature.selectImageMatrixState;
export const selectAllImageTasks = createSelector(selectImageState, state => state.tasks);
export const selectTaskById = (id: string) => createSelector(selectAllImageTasks, tasks => tasks.find(t => t.id === id));
