'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import NFTArt from './NFTArt';
import { NFT } from '@/lib/nfts';

interface NFTCardProps {
  nft: NFT;
  index: number;
  remaining: number;
  onSelect: (nft: NFT) => void;
}

export default function NFTCard({ nft, index, remaining, onSelect }: NFTCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isSoldOut = remaining <= 0;
  const minted = nft.maxSupply - remaining;

  // 3D tilt with mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rarityColors: Record<string, string> = {
    Uncommon: 'text-neon-purple',
    Rare: 'text-neon-cyan',
    Epic: 'text-neon-pink',
    Legendary: 'text-neon-emerald',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`holo-card group ${isSoldOut ? '' : 'cursor-pointer'}`}
      >
        <div
          className={`relative rounded-[24px] bg-white/[0.02] border border-white/[0.05] overflow-hidden transition-all duration-500 ${
            isSoldOut
              ? 'opacity-60'
              : 'group-hover:bg-white/[0.04] group-hover:border-white/[0.08]'
          }`}
        >
          {/* NFT Art */}
          <div className="relative aspect-square overflow-hidden">
            {/* Color glow behind art */}
            {!isSoldOut && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${nft.colorPrimary}15 0%, transparent 70%)`,
                }}
              />
            )}
            <NFTArt id={nft.id} />

            {/* SOLD OUT overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                <div className="px-6 py-3 rounded-xl bg-white/[0.08] border border-white/[0.1]">
                  <span className="text-lg font-black tracking-widest text-white/80">
                    SOLD OUT
                  </span>
                </div>
              </div>
            )}

            {/* Supply badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.06]">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isSoldOut ? 'bg-red-500' : remaining <= 3 ? 'bg-yellow-500 animate-pulse' : 'bg-neon-emerald'
                }`}
              />
              <span className="text-[10px] font-mono text-white/60">
                {isSoldOut ? '0' : remaining}/{nft.maxSupply}
              </span>
            </div>
          </div>

          {/* Info section */}
          <div className="p-5">
            {/* Name + Edition */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                {nft.name}
              </h3>
              <span className="text-[10px] font-mono text-white/25 mt-1">
                {nft.edition}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2">
              {nft.description}
            </p>

            {/* Rarity + Supply bar + Price */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-mono uppercase tracking-wider ${rarityColors[nft.rarity] || 'text-white/40'}`}
              >
                {nft.rarity}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white/90">
                  {nft.price}
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  USDC
                </span>
              </div>
            </div>

            {/* Supply progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                <span>{minted} minted</span>
                <span>{remaining} left</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(minted / nft.maxSupply) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.15 + 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: isSoldOut
                      ? '#ef4444'
                      : `linear-gradient(90deg, ${nft.colorPrimary}, ${nft.colorSecondary})`,
                  }}
                />
              </div>
            </div>

            {/* Purchase button */}
            {isSoldOut ? (
              <div className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide text-center bg-white/[0.03] border border-white/[0.04] text-white/25 cursor-not-allowed">
                Sold Out
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(nft);
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${nft.colorPrimary}20, ${nft.colorPrimary}10)`,
                  border: `1px solid ${nft.colorPrimary}30`,
                  color: nft.colorPrimary,
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Purchase
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            )}
          </div>

          {/* Shimmer overlay on hover */}
          {!isSoldOut && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[24px]">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${nft.colorPrimary}08 45%, ${nft.colorPrimary}05 55%, transparent 60%)`,
                  animation: 'shimmer 3s linear infinite',
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
