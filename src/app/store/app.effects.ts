import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  // Example effect: log when a task fails
  logFailedTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.failTask),
      tap(({ id }) => console.error(`Task ${id} failed`))
    );
  }, { dispatch: false });
}
