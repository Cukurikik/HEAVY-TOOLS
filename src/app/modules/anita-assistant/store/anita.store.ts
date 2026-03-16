import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AnitaState, ChatMessage } from '../types';
import { inject } from '@angular/core';
import { AnitaService } from '../services/anita.service';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

const initialState: AnitaState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const AnitaStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, anitaService = inject(AnitaService)) => ({
    sendMessage: rxMethod<string>(
      pipe(
        tap((content) => {
          const userMessage: ChatMessage = { role: 'user', content, timestamp: new Date() };
          patchState(store, (state) => ({
            messages: [...state.messages, userMessage],
            isLoading: true,
            error: null,
          }));
        }),
        switchMap((content) => {
          return anitaService.sendMessage(content).pipe(
            tapResponse({
              next: (res: { response: string; error?: string }) => {
                 const assistantMsg: ChatMessage = { role: 'assistant', content: res.response || res.error || 'No response', timestamp: new Date() };
                 patchState(store, (state) => ({
                   messages: [...state.messages, assistantMsg],
                   isLoading: false,
                 }));
              },
              error: (err: unknown) => {
                 const assistantMsg: ChatMessage = { role: 'assistant', content: 'System Error: ' + JSON.stringify(err), timestamp: new Date() };
                 patchState(store, (state) => ({
                   messages: [...state.messages, assistantMsg],
                   error: 'Failed to communicate with ANITA',
                   isLoading: false,
                 }));
              }
            })
          );
        })
      )
    ),
    clearChat: () => patchState(store, { messages: [], error: null }),
  }))
);
