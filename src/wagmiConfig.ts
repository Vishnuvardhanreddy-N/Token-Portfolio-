import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    metaMask(),
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: '3828825d9007084efab663f3130c6a26',
      showQrModal: true,
    }),
  ],
  ssr: false,
});