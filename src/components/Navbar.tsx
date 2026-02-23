'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NavbarProps {
  wallet: {
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    connect: () => Promise<string | null>;
    disconnect: () => void;
  };
}

export default function Navbar({ wallet }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan animate-spin-slow" />
            <div className="absolute inset-[2px] rounded-[6px] bg-void flex items-center justify-center">
              <span className="text-xs font-bold gradient-text">F</span>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wide">
            <span className="text-white/90">Facinet</span>
            <span className="text-white/40 ml-1">SDK Demo</span>
          </span>
        </div>

        {/* Network Badge + Wallet */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-mono text-white/40">
              Avalanche Fuji
            </span>
          </div>

          {wallet.isConnected && wallet.address ? (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={wallet.disconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full bg-neon-emerald" />
              <span className="text-xs font-mono text-white/60 group-hover:text-white/80 transition-colors">
                {truncateAddress(wallet.address)}
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className="relative px-5 py-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-xs font-semibold tracking-wide hover:shadow-lg hover:shadow-neon-purple/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {wallet.isConnecting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Connect Wallet'
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
