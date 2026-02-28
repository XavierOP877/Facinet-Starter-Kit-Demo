// ============================================
// Avalanche Team1 India - Configuration
// ============================================

export const APP_CONFIG = {
  // Network: Avalanche Fuji Testnet
  chainId: 43113,
  chainIdHex: '0xA869',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',

  // Deployed Team1IndiaNFT contract address (set in .env.local after deploying)
  nftContractAddress: (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,

  // Max supply
  maxSupply: 500,

  // Avalanche Fuji network details (for wallet)
  networkParams: {
    chainId: '0xA869',
    chainName: 'Avalanche Fuji C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
  },

  // Block explorer for transaction links
  explorerUrl: 'https://testnet.snowtrace.io',

  // Core Wallet install link
  coreWalletInstallUrl:
    'https://chromewebstore.google.com/detail/core-wallet-crypto-made-e/agoakfejjabomempkjlepdflaleeobhb?hl=gu',
};

// ============================================
// Team1IndiaNFT Contract ABI (minimal)
// ============================================
export const NFT_CONTRACT_ABI = [
  // --- Write functions ---
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // --- Read functions ---
  {
    inputs: [],
    name: 'remainingSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
