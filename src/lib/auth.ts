/**
 * Auth Module Stub
 * Provides a placeholder auth helper until NextAuth is fully configured.
 * Once NextAuth is set up, replace this with the real auth() export.
 */

export async function auth() {
  // TODO: Replace with NextAuth.js v5 when configured
  // import NextAuth from 'next-auth';
  // export const { auth } = NextAuth({ providers: [...] });
  return {
    user: {
      id: 'local-user',
      name: 'Omni-Tool User',
      email: 'user@omni-tool.local',
    },
  };
}

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};
