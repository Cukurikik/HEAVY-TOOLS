import { z } from 'zod';

export const AnitaMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.date(),
  codeBlocks: z.array(z.object({
    language: z.string(),
    code: z.string(),
    filename: z.string().optional()
  })).optional()
});

export type AnitaMessage = z.infer<typeof AnitaMessageSchema>;

export interface AnitaSession {
  id: string;
  title: string;
  messages: AnitaMessage[];
  createdAt: Date;
  updatedAt: Date;
}
