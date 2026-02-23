'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NFTGallery from '@/components/NFTGallery';
import PurchaseModal from '@/components/PurchaseModal';
import { useWallet } from '@/hooks/useWallet';
import { useNFTSupply } from '@/hooks/useNFTSupply';
import { NFT } from '@/lib/nfts';

// Load particle canvas only on client (uses canvas API)
const ParticleCanvas = dynamic(() => import('@/components/ParticleCanvas'), {
  ssr: false,
});

export default function Home() {
  const wallet = useWallet();
  const { remaining, refresh: refreshSupply } = useNFTSupply();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const handleClose = useCallback(() => {
    setSelectedNFT(null);
    // Refresh supply data after modal closes (in case a purchase happened)
    refreshSupply();
  }, [refreshSupply]);

  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden noise-overlay">
      {/* Animated particle background */}
      <ParticleCanvas />

      {/* Navigation with wallet connection */}
      <Navbar wallet={wallet} />

      {/* Hero section */}
      <Hero />

      {/* NFT Gallery — supply data passed in */}
      <NFTGallery onSelect={setSelectedNFT} remaining={remaining} />

      {/* Purchase Modal */}
      {selectedNFT && (
        <PurchaseModal
          nft={selectedNFT}
          wallet={wallet}
          onClose={handleClose}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan animate-spin-slow" />
              <div className="absolute inset-[1.5px] rounded-[5px] bg-void flex items-center justify-center">
                <span className="text-[8px] font-bold gradient-text">F</span>
              </div>
            </div>
            <span className="text-xs text-white/30">
              Facinet SDK Starter Demo
            </span>
          </div>
          <p className="text-[11px] text-white/15 max-w-sm mx-auto leading-relaxed">
            Gasless USDC payments on Avalanche Fuji powered by the{' '}
            <a
              href="https://www.npmjs.com/package/facinet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/40 underline underline-offset-2 transition-colors"
            >
              Facinet SDK
            </a>
            . Built for demonstration purposes.
          </p>
        </div>
      </footer>
    </main>
  );
}
