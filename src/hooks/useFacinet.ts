'use client';

// ============================================
// useFacinet Hook — Facinet SDK Integration
// ============================================
// This hook wraps the Facinet SDK for:
//   1. Gasless USDC payments  (facinet.pay)
//   2. Gasless NFT minting    (facinet.executeContract)
//
// >>> FACINET SDK USAGE LOCATIONS <<<
//   - Lines 51-63:  facinet.pay()            — USDC payment
//   - Lines 69-78:  facinet.executeContract() — NFT mint
// ============================================

import { useState, useCallback } from 'react';
import { FACINET_CONFIG, NFT_CONTRACT_ABI } from '@/lib/config';

export type PurchasePhase = 'idle' | 'paying' | 'minting' | 'done';

interface PurchaseResult {
  success: boolean;
  paymentTxHash: string;
  mintTxHash: string;
  facilitatorName: string;
  network: string;
}

export function useFacinet() {
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<PurchasePhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PurchaseResult | null>(null);

  const purchaseNFT = useCallback(
    async (
      nftType: number,
      price: string,
      buyerAddress: string
    ): Promise<PurchaseResult> => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        // ============================================
        // FACINET SDK USAGE — Step 1: Gasless USDC Payment
        // ============================================
        setPhase('paying');

        // 1a. Dynamically import Facinet (client-side only)
        const { Facinet } = await import('facinet');

        // 1b. Initialize Facinet for Avalanche Fuji
        //     No private key — uses MetaMask for signing!
        //     apiUrl points to our Next.js proxy to avoid CORS issues
        const facinet = new Facinet({
          network: FACINET_CONFIG.network, // 'avalanche-fuji'
          apiUrl: `${window.location.origin}/api/facinet`,
        });

        // 1c. Execute gasless USDC payment
        //     User signs with MetaMask (NO gas!)
        //     Facilitator executes on-chain & pays gas
        const paymentResult = await facinet.pay({
          amount: price,
          recipient: FACINET_CONFIG.recipientAddress,
        });

        // ============================================
        // FACINET SDK USAGE — Step 2: Gasless NFT Mint
        // ============================================
        setPhase('minting');

        // 2. Call the FacinetNFT contract's mint(to, nftType) function
        //    via Facinet's executeContract — facilitator pays gas!
        //    The NFT is minted directly to the buyer's wallet.
        //    Token ID is auto-assigned by the contract.
        const mintResult = await facinet.executeContract({
          contractAddress: FACINET_CONFIG.nftContractAddress,
          functionName: 'mint',
          functionArgs: [buyerAddress, nftType],
          abi: NFT_CONTRACT_ABI,
        });
        // ============================================
        // END FACINET SDK USAGE
        // ============================================

        setPhase('done');

        const purchaseResult: PurchaseResult = {
          success: paymentResult.success && mintResult.success,
          paymentTxHash: paymentResult.txHash,
          mintTxHash: mintResult.txHash,
          facilitatorName: paymentResult.facilitator.name,
          network: paymentResult.payment.network,
        };

        setResult(purchaseResult);
        return purchaseResult;
      } catch (err: unknown) {
        const error = err as { message?: string };
        const message = error.message || 'Purchase failed';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setPhase('idle');
    setError(null);
    setResult(null);
  }, []);

  return { purchaseNFT, loading, phase, error, result, reset };
}
