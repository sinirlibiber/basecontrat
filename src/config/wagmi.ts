import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

const projectId: string = '8b0afcaf99464b72fe69705db84248f0';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    walletConnect({ projectId, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Base Contract Deployer',
      appLogoUrl: 'https://base.org/favicon.ico',
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});

export const networks = [
  {
    id: base.id,
    name: 'Base Mainnet',
    chain: base,
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
  },
  {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    chain: baseSepolia,
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
  },
];
