'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type Config } from 'wagmi';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

const projectId: string = '8b0afcaf99464b72fe69705db84248f0';

const metadata = {
  name: 'Base Contract Deployer',
  description: 'Deploy smart contracts on Base network',
  url: 'https://base.org',
  icons: ['https://base.org/favicon.ico'],
};

export const networks = [base, baseSepolia];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: ['farcaster'],
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#0052FF',
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig as Config;

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
