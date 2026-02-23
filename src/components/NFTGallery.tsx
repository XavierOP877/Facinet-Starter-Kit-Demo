'use client';

import { motion } from 'framer-motion';
import NFTCard from './NFTCard';
import { NFTS, NFT } from '@/lib/nfts';

interface NFTGalleryProps {
  onSelect: (nft: NFT) => void;
  remaining: number[];
}

export default function NFTGallery({ onSelect, remaining }: NFTGalleryProps) {
  const totalMinted = remaining.reduce(
    (sum, r, i) => sum + (NFTS[i].maxSupply - r),
    0
  );
  const totalSupply = NFTS.reduce((sum, nft) => sum + nft.maxSupply, 0);

  return (
    <section id="gallery" className="relative py-24 sm:py-32 px-6">
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
            The Collection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/90 mb-4">
            Choose Your{' '}
            <span className="gradient-text">Artifact</span>
          </h2>
          <p className="text-sm sm:text-base text-white/30 max-w-md mx-auto mb-6">
            Four unique generative art pieces, 10 editions each.
            Pay with USDC. Zero gas fees, powered by Facinet.
          </p>

          {/* Overall supply counter */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="text-xs text-white/40">Total minted:</span>
            <span className="text-sm font-bold text-white/70 font-mono">
              {totalMinted}/{totalSupply}
            </span>
            <div className="w-20 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-700"
                style={{ width: `${(totalMinted / totalSupply) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* NFT Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NFTS.map((nft, index) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            index={index}
            remaining={remaining[index]}
            onSelect={onSelect}
          />
        ))}
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
            Gasless in <span className="text-neon-cyan">3 Steps</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Connect',
              desc: 'Link your MetaMask wallet and switch to Avalanche Fuji testnet.',
              color: '#8b5cf6',
            },
            {
              step: '02',
              title: 'Sign',
              desc: 'Approve the USDC transfer with just a signature — no gas required.',
              color: '#06b6d4',
            },
            {
              step: '03',
              title: 'Collect',
              desc: 'Facinet facilitator pays gas for both USDC transfer and NFT mint. The NFT lands directly in your wallet.',
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
