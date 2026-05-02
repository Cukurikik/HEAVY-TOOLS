/**
 * Auth Module Stub
 * Provides a placeholder auth helper until an authentication provider (e.g. NextAuth) is fully configured.
 *
 * @returns A mocked session object for local development.
 */
export async function auth(): Promise<Session | null> {
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
