import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ImageActions } from './image.actions';
import { DashScopeService } from '../api/dashscope.service';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class ImageEffects {
  private actions$ = inject(Actions);
  private dashScopeApi = inject(DashScopeService);

  generateImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.generateImage),
      switchMap(({ prompt, size, taskId }) => {
        return this.dashScopeApi.generateImage(prompt, size).pipe(
          map(response => {
            const taskStatus = response.output?.task_status;
            if (taskStatus === 'SUCCEEDED' && response.output?.results?.length) {
              return ImageActions.generateImageSuccess({ taskId, resultUrl: response.output.results[0].url });
            }
            return ImageActions.updateTaskStatus({ id: taskId, status: 'processing' });
          }),
          catchError((err: Error) => of(ImageActions.generateImageFailure({ taskId, error: err.message })))
        );
      })
    );
  });

  onGenerateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.generateImageSuccess),
      map(({ taskId, resultUrl }) => ImageActions.updateTaskStatus({ id: taskId, status: 'success', outputBlobUrl: resultUrl }))
    );
  });

  onGenerateFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.generateImageFailure),
      map(({ taskId, error }) => ImageActions.updateTaskStatus({ id: taskId, status: 'error', error }))
    );
  });

  enhanceImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.enhanceImage),
      switchMap(({ file, taskId }) => {
        return this.dashScopeApi.enhanceImage(file).pipe(
          map(response => ImageActions.enhanceImageSuccess({ taskId, resultUrl: response.url })),
          catchError((err: Error) => of(ImageActions.enhanceImageFailure({ taskId, error: err.message })))
        );
      })
    );
  });

  onEnhanceSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.enhanceImageSuccess),
      map(({ taskId, resultUrl }) => ImageActions.updateTaskStatus({ id: taskId, status: 'success', outputBlobUrl: resultUrl }))
    );
  });

  onEnhanceFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.enhanceImageFailure),
      map(({ taskId, error }) => ImageActions.updateTaskStatus({ id: taskId, status: 'error', error }))
    );
  });

  restoreImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.restoreImage),
      switchMap(({ file, taskId }) => {
        return this.dashScopeApi.restorePhoto(file).pipe(
          map(response => ImageActions.restoreImageSuccess({ taskId, resultUrl: response.url })),
          catchError((err: Error) => of(ImageActions.restoreImageFailure({ taskId, error: err.message })))
        );
      })
    );
  });

  onRestoreSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.restoreImageSuccess),
      map(({ taskId, resultUrl }) => ImageActions.updateTaskStatus({ id: taskId, status: 'success', outputBlobUrl: resultUrl }))
    );
  });

  onRestoreFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.restoreImageFailure),
      map(({ taskId, error }) => ImageActions.updateTaskStatus({ id: taskId, status: 'error', error }))
    );
  });
}
