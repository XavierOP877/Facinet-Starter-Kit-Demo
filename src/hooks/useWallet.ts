'use client';

import { useState, useCallback, useEffect } from 'react';
import { APP_CONFIG } from '@/lib/config';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  showInstallPopup: boolean;
}

function getCoreProvider(): any | null {
  if (typeof window === 'undefined') return null;

  // Core Wallet injects window.avalanche
  if ((window as any).avalanche) {
    return (window as any).avalanche;
  }

  // Fallback: check window.ethereum for Core Wallet
  if (window.ethereum?.isAvalanche) {
    return window.ethereum;
  }

  // Check if window.ethereum is from Core (some versions)
  if (window.ethereum && (window.ethereum as any).isCoreWallet) {
    return window.ethereum;
  }

  return null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    showInstallPopup: false,
  });

  const dismissInstallPopup = useCallback(() => {
    setWallet((prev) => ({ ...prev, showInstallPopup: false }));
  }, []);

  const connect = useCallback(async () => {
    const provider = getCoreProvider();

    if (!provider) {
      setWallet((prev) => ({
        ...prev,
        showInstallPopup: true,
        error: 'Core Wallet not found. Please install Core Wallet.',
      }));
      return null;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null, showInstallPopup: false }));

    try {
      // Request accounts
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      // Check current chain
      const currentChainId = (await provider.request({
        method: 'eth_chainId',
      })) as string;

      // Switch to Avalanche Fuji if not already on it
      if (parseInt(currentChainId, 16) !== APP_CONFIG.chainId) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: APP_CONFIG.chainIdHex }],
          });
        } catch (switchError: unknown) {
          const err = switchError as { code?: number };
          if (err.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [APP_CONFIG.networkParams],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWallet({
        address: accounts[0],
        chainId: APP_CONFIG.chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
        showInstallPopup: false,
      });

      return accounts[0];
    } catch (err: unknown) {
      const error = err as { message?: string };
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
      return null;
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      showInstallPopup: false,
    });
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    const provider = getCoreProvider();
    if (!provider) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWallet((prev) => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [disconnect]);

  return { ...wallet, connect, disconnect, dismissInstallPopup };
}
