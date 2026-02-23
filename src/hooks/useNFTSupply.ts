'use client';

// ============================================
// useNFTSupply — Reads on-chain supply data
// ============================================
// Uses ethers.js to call the FacinetNFT contract's
// getAvailability() view function (no gas, no wallet needed).
// Returns remaining supply for each NFT type (1-4).
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { FACINET_CONFIG, NFT_CONTRACT_ABI } from '@/lib/config';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function useNFTSupply() {
  // Default: all 10 available (before contract is deployed/connected)
  const [remaining, setRemaining] = useState<number[]>([10, 10, 10, 10]);
  const [loading, setLoading] = useState(true);

  const fetchSupply = useCallback(async () => {
    // Skip if contract not deployed yet
    if (
      !FACINET_CONFIG.nftContractAddress ||
      FACINET_CONFIG.nftContractAddress === ZERO_ADDRESS
    ) {
      setLoading(false);
      return;
    }

    try {
      // Dynamic import ethers to avoid SSR issues
      const { ethers } = await import('ethers');

      const provider = new ethers.JsonRpcProvider(FACINET_CONFIG.rpcUrl);
      const contract = new ethers.Contract(
        FACINET_CONFIG.nftContractAddress,
        NFT_CONTRACT_ABI,
        provider
      );

      // getAvailability() returns uint256[4] — remaining per type
      const availability: bigint[] = await contract.getAvailability();
      setRemaining(availability.map((val) => Number(val)));
    } catch (err) {
      console.error('Failed to fetch NFT supply:', err);
      // Keep defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchSupply();
  }, [fetchSupply]);

  return { remaining, loading, refresh: fetchSupply };
}
