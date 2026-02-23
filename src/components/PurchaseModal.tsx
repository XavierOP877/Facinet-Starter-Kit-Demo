'use client';

// ============================================
// Purchase Modal — NFT Purchase Flow
// Uses Facinet SDK for:
//   1. Gasless USDC payment  (facinet.pay)
//   2. Gasless NFT minting   (facinet.executeContract)
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NFTArt from './NFTArt';
import { useFacinet, PurchasePhase } from '@/hooks/useFacinet';
import { FACINET_CONFIG } from '@/lib/config';
import { NFT } from '@/lib/nfts';

type PurchaseStep = 'review' | 'processing' | 'success' | 'error';

interface PurchaseModalProps {
  nft: NFT;
  wallet: {
    address: string | null;
    isConnected: boolean;
    connect: () => Promise<string | null>;
  };
  onClose: () => void;
}

export default function PurchaseModal({
  nft,
  wallet,
  onClose,
}: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('review');
  const { purchaseNFT, phase, error, result, reset } = useFacinet();
  const [confetti, setConfetti] = useState<
    { x: number; color: string; delay: number; size: number; round: boolean }[]
  >([]);

  // Generate confetti on success
  useEffect(() => {
    if (step === 'success') {
      const pieces = Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        color: [nft.colorPrimary, nft.colorSecondary, '#fff', '#fbbf24'][
          Math.floor(Math.random() * 4)
        ],
        delay: Math.random() * 0.5,
        size: Math.random() * 6 + 4,
        round: Math.random() > 0.5,
      }));
      setConfetti(pieces);
    }
  }, [step, nft.colorPrimary, nft.colorSecondary]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, step]);

  const handlePurchase = useCallback(async () => {
    if (!wallet.isConnected || !wallet.address) {
      await wallet.connect();
      return;
    }

    setStep('processing');

    try {
      // ============================================
      // >>> FACINET SDK CALLS HAPPEN HERE <<<
      // The useFacinet hook calls:
      //   1. facinet.pay()            — USDC payment (gasless)
      //   2. facinet.executeContract() — NFT mint (gasless)
      // See: src/hooks/useFacinet.ts lines 50-77
      // ============================================
      await purchaseNFT(nft.nftType, nft.price, wallet.address);
      setStep('success');
    } catch {
      setStep('error');
    }
  }, [wallet, nft, purchaseNFT]);

  const handleRetry = () => {
    reset();
    setStep('review');
  };

  // Map phase to step index for the progress indicator
  const phaseToStepIndex = (p: PurchasePhase): number => {
    switch (p) {
      case 'paying':
        return 0;
      case 'minting':
        return 1;
      case 'done':
        return 2;
      default:
        return 0;
    }
  };

  const activeStepIndex = phaseToStepIndex(phase);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== 'processing' ? onClose : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-[#0a0a1a] border border-white/[0.06] overflow-hidden"
        >
          {/* Confetti on success */}
          {step === 'success' &&
            confetti.map((piece, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${piece.x}%`,
                  top: '-10px',
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  backgroundColor: piece.color,
                  animationDelay: `${piece.delay}s`,
                  borderRadius: piece.round ? '50%' : '2px',
                }}
              />
            ))}

          {/* Close button */}
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* NFT Preview */}
          <div className="relative p-6 pb-0">
            <div
              className="rounded-2xl overflow-hidden border border-white/[0.04]"
              style={{
                boxShadow: `0 0 60px ${nft.colorPrimary}10`,
              }}
            >
              <NFTArt id={nft.id} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* === REVIEW STEP === */}
            {step === 'review' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-white/90">
                    {nft.name}
                  </h3>
                  <span className="text-[10px] font-mono text-white/25 mt-1.5">
                    {nft.edition}
                  </span>
                </div>
                <p className="text-xs text-white/30 leading-relaxed mb-5">
                  {nft.description}
                </p>

                {/* Price breakdown */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-5 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">NFT Price</span>
                    <span className="text-white/70 font-medium">
                      {nft.price} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Gas Fee (Payment)</span>
                    <span className="text-neon-emerald font-medium">
                      0 (Gasless!)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Gas Fee (Mint)</span>
                    <span className="text-neon-emerald font-medium">
                      0 (Gasless!)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Network</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      Avalanche Fuji
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Type</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      #{nft.nftType} — 10 editions
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Powered by</span>
                    <span className="text-neon-purple font-medium">
                      Facinet SDK
                    </span>
                  </div>
                  <div className="border-t border-white/[0.04] pt-2.5 flex justify-between">
                    <span className="text-xs text-white/50 font-medium">
                      Total
                    </span>
                    <span className="text-sm text-white font-bold">
                      {nft.price} USDC + 0 Gas
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handlePurchase}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${nft.colorPrimary}, ${nft.colorSecondary})`,
                  }}
                >
                  {!wallet.isConnected
                    ? 'Connect Wallet to Purchase'
                    : `Pay ${nft.price} USDC & Mint NFT — Gasless`}
                </motion.button>

                {wallet.isConnected && wallet.address && (
                  <p className="text-[10px] text-white/20 text-center mt-3 font-mono">
                    Wallet: {wallet.address.slice(0, 6)}...
                    {wallet.address.slice(-4)} | NFT mints directly to you
                  </p>
                )}
              </motion.div>
            )}

            {/* === PROCESSING STEP === */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                {/* Animated spinner */}
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: nft.colorPrimary,
                      animationDuration: '1s',
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderBottomColor: nft.colorSecondary,
                      animationDuration: '1.5s',
                      animationDirection: 'reverse',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: nft.colorPrimary }}
                    />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white/80 mb-2">
                  {phase === 'paying' && 'Paying USDC...'}
                  {phase === 'minting' && 'Minting NFT...'}
                  {phase === 'idle' && 'Preparing...'}
                  {phase === 'done' && 'Confirming...'}
                </h3>
                <p className="text-xs text-white/30 leading-relaxed max-w-xs mx-auto">
                  {phase === 'paying' && (
                    <>
                      Sign the USDC payment in MetaMask.
                      <br />
                      <span className="text-white/20">
                        Facilitator covers the gas via facinet.pay()
                      </span>
                    </>
                  )}
                  {phase === 'minting' && (
                    <>
                      Payment confirmed! Now minting your NFT...
                      <br />
                      <span className="text-white/20">
                        Facilitator calls mint() via facinet.executeContract()
                      </span>
                    </>
                  )}
                  {(phase === 'idle' || phase === 'done') && (
                    <span className="text-white/20">
                      Processing your transaction...
                    </span>
                  )}
                </p>

                {/* Step indicators — now showing Pay → Mint → Done */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[
                    { label: 'Pay USDC', desc: 'facinet.pay()' },
                    { label: 'Mint NFT', desc: 'executeContract()' },
                    { label: 'Done', desc: 'Confirmed' },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                            i < activeStepIndex
                              ? 'bg-neon-emerald/20 text-neon-emerald'
                              : i === activeStepIndex
                                ? 'bg-white/10 text-white/70'
                                : 'bg-white/[0.03] text-white/20'
                          }`}
                        >
                          {i < activeStepIndex ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="text-[9px] text-white/25 mt-1 whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                      {i < 2 && (
                        <div
                          className={`w-8 h-px mb-4 transition-colors duration-300 ${
                            i < activeStepIndex
                              ? 'bg-neon-emerald/30'
                              : 'bg-white/[0.06]'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* === SUCCESS STEP === */}
            {step === 'success' && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-2"
              >
                {/* Checkmark */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: `${nft.colorPrimary}15`,
                    border: `2px solid ${nft.colorPrimary}40`,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={nft.colorPrimary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-white/90 mb-1">
                  NFT Purchased & Minted!
                </h3>
                <p className="text-xs text-white/30 mb-5">
                  Gasless payment + mint processed by{' '}
                  <span style={{ color: nft.colorPrimary }}>
                    {result.facilitatorName}
                  </span>
                </p>

                {/* Transaction details */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-left space-y-2 mb-5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Payment Tx</span>
                    <a
                      href={`${FACINET_CONFIG.explorerUrl}/tx/${result.paymentTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] hover:underline"
                      style={{ color: nft.colorPrimary }}
                    >
                      {result.paymentTxHash.slice(0, 8)}...{result.paymentTxHash.slice(-6)}
                    </a>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Mint Tx</span>
                    <a
                      href={`${FACINET_CONFIG.explorerUrl}/tx/${result.mintTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] hover:underline"
                      style={{ color: nft.colorPrimary }}
                    >
                      {result.mintTxHash.slice(0, 8)}...{result.mintTxHash.slice(-6)}
                    </a>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Amount</span>
                    <span className="text-white/70">{nft.price} USDC</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Edition</span>
                    <span className="text-white/70 font-mono">1 of 10</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Facilitator</span>
                    <span className="text-white/50">
                      {result.facilitatorName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Network</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      {result.network}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Gas Paid</span>
                    <span className="text-neon-emerald">
                      $0.00 (Facinet covered both txs!)
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-white/20 mb-4">
                  The NFT is now in your wallet. Check MetaMask or Snowtrace to view it.
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-sm font-medium bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/80 transition-all cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}

            {/* === ERROR STEP === */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-500/10 border-2 border-red-500/30">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-white/80 mb-2">
                  Transaction Failed
                </h3>
                <p className="text-xs text-red-400/60 mb-5 max-w-xs mx-auto">
                  {error || 'Something went wrong. Please try again.'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/[0.05] text-white/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRetry}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${nft.colorPrimary}, ${nft.colorSecondary})`,
                    }}
                  >
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
