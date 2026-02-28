interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isAvalanche?: boolean;
  isCoreWallet?: boolean;
  selectedAddress?: string;
}

interface Window {
  ethereum?: EthereumProvider;
  avalanche?: EthereumProvider;
}
