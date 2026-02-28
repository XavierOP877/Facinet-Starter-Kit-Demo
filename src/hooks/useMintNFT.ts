'use client';

import { useState, useCallback } from 'react';
import { APP_CONFIG, NFT_CONTRACT_ABI } from '@/lib/config';

export type MintPhase = 'idle' | 'confirming' | 'minting' | 'done';

export interface MintResult {
  success: boolean;
  txHash: string;
}

function getCoreProvider(): any | null {
  if (typeof window === 'undefined') return null;
  if ((window as any).avalanche) return (window as any).avalanche;
  if (window.ethereum?.isAvalanche) return window.ethereum;
  if (window.ethereum && (window.ethereum as any).isCoreWallet) return window.ethereum;
  return null;
}

export function useMintNFT() {
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<MintPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintResult | null>(null);

  const mintNFT = useCallback(async (): Promise<MintResult> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setPhase('confirming');

      const { ethers } = await import('ethers');

      const provider = getCoreProvider();
      if (!provider) {
        throw new Error('Core Wallet not found');
      }

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(
        APP_CONFIG.nftContractAddress,
        NFT_CONTRACT_ABI,
        signer
      );

      setPhase('minting');

      // Call claim() — user pays gas
      const tx = await contract.claim();

      // Wait for confirmation
      const receipt = await tx.wait();

      setPhase('done');

      const mintResult: MintResult = {
        success: true,
        txHash: receipt.hash,
      };

      setResult(mintResult);
      return mintResult;
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string; reason?: string };
      let message = error.reason || error.message || 'Claim failed';

      if (error.code === 'ACTION_REJECTED' || message.includes('user rejected')) {
        message = 'Transaction was rejected in your wallet.';
      } else if (message.includes('All 500')) {
        message = 'All 500 NFTs have been claimed. Collection is sold out!';
      }

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setPhase('idle');
    setError(null);
    setResult(null);
  }, []);

  return { mintNFT, loading, phase, error, result, reset };
}
