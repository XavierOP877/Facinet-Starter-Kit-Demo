// ============================================
// Facinet SDK Starter Demo - Configuration
// ============================================

export const FACINET_CONFIG = {
  // Network: Avalanche Fuji Testnet
  network: 'avalanche-fuji' as const,
  chainId: 43113,
  chainIdHex: '0xA869',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',

  // Recipient wallet for USDC payments (set in .env.local)
  recipientAddress: (process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,

  // Deployed FacinetNFT contract address (set in .env.local after deploying)
  nftContractAddress: (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,

  // Supply per NFT type
  maxPerType: 10,

  // Avalanche Fuji network details (for MetaMask)
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
};

// ============================================
// FacinetNFT Contract ABI (minimal — only what the frontend needs)
// ============================================
export const NFT_CONTRACT_ABI = [
  // --- Write functions ---
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'nftType', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // --- Read functions ---
  {
    inputs: [],
    name: 'getAvailability',
    outputs: [{ name: '', type: 'uint256[4]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'nftType', type: 'uint256' }],
    name: 'isSoldOut',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'nftType', type: 'uint256' }],
    name: 'remainingSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'nftType', type: 'uint256' }],
    name: 'mintedCount',
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
