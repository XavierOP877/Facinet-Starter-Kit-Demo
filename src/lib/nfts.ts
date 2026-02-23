// ============================================
// NFT Collection Data
// ============================================

export interface NFT {
  id: string;
  nftType: number; // On-chain type (1-4), used in mint(to, nftType)
  name: string;
  description: string;
  price: string; // in USDC
  priceNum: number;
  colorPrimary: string;
  colorSecondary: string;
  rarity: string;
  edition: string;
  maxSupply: number;
}

export const NFTS: NFT[] = [
  {
    id: 'cosmic-nexus',
    nftType: 1,
    name: 'Cosmic Nexus',
    description:
      'A convergence point in the fabric of spacetime where dimensions fold inward, revealing the infinite lattice of existence.',
    price: '1',
    priceNum: 1,
    colorPrimary: '#8b5cf6',
    colorSecondary: '#a78bfa',
    rarity: 'Uncommon',
    edition: '#0001',
    maxSupply: 10,
  },
  {
    id: 'digital-phantom',
    nftType: 2,
    name: 'Digital Phantom',
    description:
      'A spectral entity born from corrupted data streams, flickering between existence and void across parallel networks.',
    price: '2',
    priceNum: 2,
    colorPrimary: '#06b6d4',
    colorSecondary: '#22d3ee',
    rarity: 'Rare',
    edition: '#0002',
    maxSupply: 10,
  },
  {
    id: 'quantum-bloom',
    nftType: 3,
    name: 'Quantum Bloom',
    description:
      'An impossible flower that exists in superposition, its petals simultaneously open and closed until observed.',
    price: '3',
    priceNum: 3,
    colorPrimary: '#ec4899',
    colorSecondary: '#f472b6',
    rarity: 'Epic',
    edition: '#0003',
    maxSupply: 10,
  },
  {
    id: 'neural-drift',
    nftType: 4,
    name: 'Neural Drift',
    description:
      'A living map of synthetic consciousness, where every pulse of light is a thought forming in the machine mind.',
    price: '5',
    priceNum: 5,
    colorPrimary: '#10b981',
    colorSecondary: '#34d399',
    rarity: 'Legendary',
    edition: '#0004',
    maxSupply: 10,
  },
];
