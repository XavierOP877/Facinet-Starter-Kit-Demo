// ============================================
// Avalanche Team1 India - Genesis NFT Data
// ============================================

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  colorPrimary: string;
  colorSecondary: string;
  maxSupply: number;
}

export const GENESIS_NFT: NFT = {
  id: 'at1-genesis',
  name: 'Avalanche Team1 India Genesis',
  description:
    'Your journey has started. Claim your Genesis NFT to prove you are part of the Avalanche Team1 India community. Limited to 500 collectors.',
  image: '/nft.png',
  colorPrimary: '#e53e3e',
  colorSecondary: '#ed8936',
  maxSupply: 500,
};
