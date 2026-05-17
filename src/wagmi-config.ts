/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cookieStorage, createStorage } from 'wagmi';
import { celo } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const metadata = {
  name: 'TwinPay AI',
  description: 'Autonomous Finance',
  url: 'https://ais-dev-bzu47ienjvue34bp4dxwhf-387500880630.asia-east1.run.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [celo]
});

export const config = wagmiAdapter.wagmiConfig;
