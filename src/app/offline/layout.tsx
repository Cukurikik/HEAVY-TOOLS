import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline Mode | Omni-Tool',
  description: 'You are currently disconnected. Some WASM tools may still function locally.',
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
