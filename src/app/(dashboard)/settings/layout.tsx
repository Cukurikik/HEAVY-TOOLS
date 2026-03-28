import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Omni-Tool Settings Hub',
  description: 'Global configuration for Omni-Tool platform',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}
