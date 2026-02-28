'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMintNFT, MintPhase } from '@/hooks/useMintNFT';
import { APP_CONFIG } from '@/lib/config';
import { GENESIS_NFT } from '@/lib/nfts';

type ClaimStep = 'review' | 'processing' | 'success' | 'error';

interface ClaimModalProps {
  wallet: {
    address: string | null;
    isConnected: boolean;
    connect: () => Promise<string | null>;
  };
  onClose: () => void;
}

export default function ClaimModal({ wallet, onClose }: ClaimModalProps) {
  const [step, setStep] = useState<ClaimStep>('review');
  const { mintNFT, phase, error, result, reset } = useMintNFT();
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState<
    { x: number; color: string; delay: number; size: number; round: boolean }[]
  >([]);

  // Generate confetti on success
  useEffect(() => {
    if (step === 'success') {
      const pieces = Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        color: ['#e53e3e', '#ed8936', '#fff', '#fbbf24'][
          Math.floor(Math.random() * 4)
        ],
        delay: Math.random() * 0.5,
        size: Math.random() * 6 + 4,
        round: Math.random() > 0.5,
      }));
      setConfetti(pieces);
    }
  }, [step]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, step]);

  const handleClaim = useCallback(async () => {
    if (!wallet.isConnected || !wallet.address) {
      await wallet.connect();
      return;
    }

    setStep('processing');

    try {
      await mintNFT();
      setStep('success');
    } catch {
      setStep('error');
    }
  }, [wallet, mintNFT]);

  const handleRetry = () => {
    reset();
    setStep('review');
  };

  const handleCopyTxHash = async () => {
    if (!result?.txHash) return;
    try {
      await navigator.clipboard.writeText(result.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = result.txHash;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const phaseToStepIndex = (p: MintPhase): number => {
    switch (p) {
      case 'confirming':
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
            <div className="rounded-2xl overflow-hidden border border-white/[0.04] shadow-lg shadow-red-500/5">
              <Image
                src="/nft.png"
                alt="Avalanche Team1 India Genesis NFT"
                width={400}
                height={400}
                className="w-full h-auto"
              />
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
                <h3 className="text-lg font-bold text-white/90 mb-1">
                  {GENESIS_NFT.name}
                </h3>
                <p className="text-xs text-white/30 leading-relaxed mb-5">
                  {GENESIS_NFT.description}
                </p>

                {/* Details */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-5 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Price</span>
                    <span className="text-neon-emerald font-medium">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Gas Fee</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      ~0.001 AVAX (testnet)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Network</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      Avalanche Fuji
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Supply</span>
                    <span className="text-white/50 font-mono text-[11px]">
                      500 editions
                    </span>
                  </div>
                  <div className="border-t border-white/[0.04] pt-2.5 flex justify-between">
                    <span className="text-xs text-white/50 font-medium">
                      Total Cost
                    </span>
                    <span className="text-sm text-white font-bold">
                      Only Gas (~0.001 AVAX)
                    </span>
                  </div>
                </div>

                {/* Claim button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleClaim}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/20"
                >
                  {!wallet.isConnected
                    ? 'Connect Core Wallet to Claim'
                    : 'Claim Genesis NFT'}
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
                      borderTopColor: '#e53e3e',
                      animationDuration: '1s',
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderBottomColor: '#ed8936',
                      animationDuration: '1.5s',
                      animationDirection: 'reverse',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white/80 mb-2">
                  {phase === 'confirming' && 'Confirm in Core Wallet...'}
                  {phase === 'minting' && 'Minting your NFT...'}
                  {phase === 'idle' && 'Preparing...'}
                  {phase === 'done' && 'Confirming...'}
                </h3>
                <p className="text-xs text-white/30 leading-relaxed max-w-xs mx-auto">
                  {phase === 'confirming' && (
                    <>
                      Please confirm the transaction in your Core Wallet.
                      <br />
                      <span className="text-white/20">
                        You will pay a small gas fee in AVAX
                      </span>
                    </>
                  )}
                  {phase === 'minting' && (
                    <>
                      Transaction submitted! Waiting for confirmation...
                      <br />
                      <span className="text-white/20">
                        Your Genesis NFT is being minted
                      </span>
                    </>
                  )}
                  {(phase === 'idle' || phase === 'done') && (
                    <span className="text-white/20">
                      Processing your transaction...
                    </span>
                  )}
                </p>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[
                    { label: 'Confirm', desc: 'Approve Tx' },
                    { label: 'Mint', desc: 'On-chain' },
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
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-neon-emerald/10 border-2 border-neon-emerald/40">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-white/90 mb-1">
                  Genesis NFT Claimed!
                </h3>
                <p className="text-xs text-white/30 mb-5">
                  Your Avalanche Team1 India Genesis NFT is now in your wallet.
                </p>

                {/* Transaction Hash - PROMINENT */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-4">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                    Transaction Hash
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                    <code className="text-[11px] font-mono text-white/70 flex-1 break-all">
                      {result.txHash}
                    </code>
                    <button
                      onClick={handleCopyTxHash}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-semibold hover:bg-red-600/30 transition-all cursor-pointer"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <a
                    href={`${APP_CONFIG.explorerUrl}/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 mt-2 transition-colors"
                  >
                    View on Explorer
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>

                {/* Important message */}
                <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-3 mb-5">
                  <p className="text-[11px] text-red-400/80 leading-relaxed">
                    Copy your transaction hash above and submit it to Avalanche Team1 India as proof of claim.
                  </p>
                </div>

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
                  Claim Failed
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
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-gradient-to-r from-red-600 to-red-500 text-white"
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
