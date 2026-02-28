'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NFTGallery from '@/components/NFTGallery';
import ClaimModal from '@/components/PurchaseModal';
import { useWallet } from '@/hooks/useWallet';
import { useNFTSupply } from '@/hooks/useNFTSupply';
import { APP_CONFIG } from '@/lib/config';

const ParticleCanvas = dynamic(() => import('@/components/ParticleCanvas'), {
  ssr: false,
});

export default function Home() {
  const wallet = useWallet();
  const { remaining, totalMinted, refresh: refreshSupply } = useNFTSupply();
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleClaim = useCallback(() => {
    setShowClaimModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowClaimModal(false);
    refreshSupply();
  }, [refreshSupply]);

  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden noise-overlay">
      <ParticleCanvas />
      <Navbar wallet={wallet} />
      <Hero />
      <NFTGallery
        onClaim={handleClaim}
        remaining={remaining}
        totalMinted={totalMinted}
      />

      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimModal wallet={wallet} onClose={handleClose} />
      )}

      {/* Core Wallet Install Popup */}
      {wallet.showInstallPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={wallet.dismissInstallPopup}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-[#0a0a1a] border border-white/[0.06] p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={wallet.dismissInstallPopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Core Wallet"
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>

            <h3 className="text-lg font-bold text-white/90 mb-2">
              Core Wallet Required
            </h3>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              To claim your Avalanche Team1 India Genesis NFT, you need to install the Core Wallet browser extension.
            </p>

            <a
              href={APP_CONFIG.coreWalletInstallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/20 transition-all text-center mb-3"
            >
              Install Core Wallet
            </a>

            <button
              onClick={wallet.dismissInstallPopup}
              className="w-full py-3 rounded-xl text-sm font-medium bg-white/[0.05] text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Avalanche Team1 India"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-xs text-white/30">
              Avalanche Team1 India
            </span>
          </div>
          <p className="text-[11px] text-white/15 max-w-sm mx-auto leading-relaxed">
            Claim your Genesis NFT on Avalanche Fuji Testnet.
            Connect Core Wallet, claim, and submit your tx hash.
          </p>
        </div>
      </footer>
    </main>
  );
}
