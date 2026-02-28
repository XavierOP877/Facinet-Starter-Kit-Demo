'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { GENESIS_NFT } from '@/lib/nfts';

interface NFTGalleryProps {
  onClaim: () => void;
  remaining: number;
  totalMinted: number;
}

export default function NFTGallery({ onClaim, remaining, totalMinted }: NFTGalleryProps) {
  const isSoldOut = remaining <= 0;

  return (
    <section id="claim" className="relative py-24 sm:py-32 px-6">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">
            Genesis Collection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/90 mb-4">
            Avalanche Team1 India{' '}
            <span className="gradient-text">Genesis</span>
          </h2>
          <p className="text-sm sm:text-base text-white/30 max-w-md mx-auto mb-6">
            Limited to 500 collectors. Claim yours now for free — you only pay gas.
          </p>

          {/* Supply counter */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="text-xs text-white/40">Claimed:</span>
            <span className="text-sm font-bold text-white/70 font-mono">
              {totalMinted}/{GENESIS_NFT.maxSupply}
            </span>
            <div className="w-24 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-700"
                style={{ width: `${(totalMinted / GENESIS_NFT.maxSupply) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Single NFT Card - Centered */}
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="holo-card group"
        >
          <div
            className={`relative rounded-[24px] bg-white/[0.02] border border-white/[0.05] overflow-hidden transition-all duration-500 ${
              isSoldOut
                ? 'opacity-60'
                : 'group-hover:bg-white/[0.04] group-hover:border-white/[0.08]'
            }`}
          >
            {/* NFT Image */}
            <div className="relative aspect-square overflow-hidden">
              {!isSoldOut && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at center, rgba(229,62,62,0.08) 0%, transparent 70%)`,
                  }}
                />
              )}
              <Image
                src="/nft.png"
                alt="Avalanche Team1 India Genesis NFT"
                fill
                className="object-cover"
              />

              {/* SOLD OUT overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="px-6 py-3 rounded-xl bg-white/[0.08] border border-white/[0.1]">
                    <span className="text-lg font-black tracking-widest text-white/80">
                      ALL CLAIMED
                    </span>
                  </div>
                </div>
              )}

              {/* Supply badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.06]">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSoldOut ? 'bg-red-500' : remaining <= 50 ? 'bg-yellow-500 animate-pulse' : 'bg-neon-emerald'
                  }`}
                />
                <span className="text-[10px] font-mono text-white/60">
                  {remaining}/{GENESIS_NFT.maxSupply}
                </span>
              </div>
            </div>

            {/* Info section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white/90 mb-2">
                {GENESIS_NFT.name}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed mb-5">
                {GENESIS_NFT.description}
              </p>

              {/* Details */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
                    Genesis
                  </span>
                  <span className="text-[10px] text-white/20">|</span>
                  <span className="text-[10px] font-mono text-white/30">
                    500 editions
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-neon-emerald">
                    Free
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    + gas
                  </span>
                </div>
              </div>

              {/* Supply progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                  <span>{totalMinted} claimed</span>
                  <span>{remaining} left</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(totalMinted / GENESIS_NFT.maxSupply) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-500"
                  />
                </div>
              </div>

              {/* Claim button */}
              {isSoldOut ? (
                <div className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide text-center bg-white/[0.03] border border-white/[0.04] text-white/25 cursor-not-allowed">
                  All Claimed
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClaim}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    Claim Genesis NFT
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
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto mt-24"
      >
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">
            How It Works
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white/80">
            Claim in <span className="text-red-500">3 Steps</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Install Core Wallet',
              desc: 'Install Core Wallet extension and get some testnet AVAX from the faucet.',
              color: '#e53e3e',
            },
            {
              step: '02',
              title: 'Connect & Claim',
              desc: 'Connect your Core Wallet and click Claim to mint your Genesis NFT.',
              color: '#ed8936',
            },
            {
              step: '03',
              title: 'Copy Tx Hash',
              desc: 'After claiming, copy your transaction hash and submit it to us as proof.',
              color: '#10b981',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:bg-white/[0.04] transition-all"
            >
              <span
                className="text-4xl font-black opacity-10 absolute top-4 right-4"
                style={{ color: item.color }}
              >
                {item.step}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${item.color}15` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
              </div>
              <h4 className="text-sm font-semibold text-white/80 mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-white/30 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
