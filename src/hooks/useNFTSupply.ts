'use client';

import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG, NFT_CONTRACT_ABI } from '@/lib/config';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function useNFTSupply() {
  const [remaining, setRemaining] = useState<number>(500);
  const [totalMinted, setTotalMinted] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchSupply = useCallback(async () => {
    if (
      !APP_CONFIG.nftContractAddress ||
      APP_CONFIG.nftContractAddress === ZERO_ADDRESS
    ) {
      setLoading(false);
      return;
    }

    try {
      const { ethers } = await import('ethers');

      const provider = new ethers.JsonRpcProvider(APP_CONFIG.rpcUrl);
      const contract = new ethers.Contract(
        APP_CONFIG.nftContractAddress,
        NFT_CONTRACT_ABI,
        provider
      );

      const [remainingVal, mintedVal] = await Promise.all([
        contract.remainingSupply(),
        contract.totalMinted(),
      ]);

      setRemaining(Number(remainingVal));
      setTotalMinted(Number(mintedVal));
    } catch (err) {
      console.error('Failed to fetch NFT supply:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupply();
  }, [fetchSupply]);

  return { remaining, totalMinted, loading, refresh: fetchSupply };
}
