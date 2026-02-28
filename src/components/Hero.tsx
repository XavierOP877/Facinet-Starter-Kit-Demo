'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora orbs */}
      <div className="aurora-orb w-[500px] h-[500px] bg-red-600/20 -top-40 -left-40 animate-float" />
      <div className="aurora-orb w-[400px] h-[400px] bg-orange-500/15 top-20 -right-20 animate-float-delayed" />
      <div className="aurora-orb w-[300px] h-[300px] bg-red-500/10 bottom-20 left-1/3 animate-float" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/logo.png"
            alt="Avalanche Team1 India"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-widest">
            Avalanche Team1 India
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
        >
          <span className="block text-white">Claim Your</span>
          <span className="block gradient-text">Genesis NFT</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed mb-10"
        >
          Connect your{' '}
          <span className="text-white/70">Core Wallet</span>, get some testnet
          AVAX, and claim your exclusive{' '}
          <span className="text-red-400">Avalanche Team1 India Genesis NFT</span>.
          Then copy the tx hash and submit it to us.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#claim"
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold tracking-wide hover:shadow-xl hover:shadow-red-500/25 transition-all"
          >
            Claim NFT
            <span className="inline-block ml-2 group-hover:translate-y-1 transition-transform">
              &darr;
            </span>
          </a>
          <a
            href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            Get Testnet AVAX
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
        >
          {[
            { value: '500', label: 'Total Supply' },
            { value: 'Free', label: 'Mint Price' },
            { value: 'Core', label: 'Wallet' },
            { value: 'Fuji', label: 'Network' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white/80">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
