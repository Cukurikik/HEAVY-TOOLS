import { createActionGroup, props } from '@ngrx/store';
import { ImageTask } from '../types/image-task.type';

export const ImageActions = createActionGroup({
  source: 'Image Matrix',
  events: {
    'Add Task': props<{ task: ImageTask }>(),
    'Update Task Status': props<{ id: string; status: string; outputBlobUrl?: string; error?: string }>(),
    'Remove Task': props<{ id: string }>(),
    'Clear All': props<Record<string, never>>(),

    'Generate Image': props<{ prompt: string; size: string; taskId: string }>(),
    'Generate Image Success': props<{ taskId: string; resultUrl: string }>(),
    'Generate Image Failure': props<{ taskId: string; error: string }>(),

    'Enhance Image': props<{ file: File; prompt?: string; taskId: string }>(),
    'Enhance Image Success': props<{ taskId: string; resultUrl: string }>(),
    'Enhance Image Failure': props<{ taskId: string; error: string }>(),

    'Restore Image': props<{ file: File; taskId: string }>(),
    'Restore Image Success': props<{ taskId: string; resultUrl: string }>(),
    'Restore Image Failure': props<{ taskId: string; error: string }>()
  }
});
