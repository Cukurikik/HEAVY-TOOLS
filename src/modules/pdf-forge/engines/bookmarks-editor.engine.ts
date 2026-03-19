// Engine: pdf-lib outline | Execution: client
import type { PdfOperation } from '../types';

export interface BookmarksEditorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getBookmarksEditorConfig(): BookmarksEditorEngineConfig {
  return {
    operation: 'bookmarks-edit',
    engine: 'pdf-lib outline',
    execution: 'client',
    description: 'Edit outline/bookmarks PDF',
    defaultOptions: {
      bookmarkTitle: 'Chapter 1',
      bookmarkPage: 1
    },
  };
}
