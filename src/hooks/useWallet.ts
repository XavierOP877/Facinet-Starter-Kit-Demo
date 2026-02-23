'use client';

import { useState, useCallback, useEffect } from 'react';
import { FACINET_CONFIG } from '@/lib/config';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask not found. Please install MetaMask.',
      }));
      return null;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request accounts
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      // Check current chain
      const currentChainId = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;

      // Switch to Avalanche Fuji if not already on it
      if (parseInt(currentChainId, 16) !== FACINET_CONFIG.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: FACINET_CONFIG.chainIdHex }],
          });
        } catch (switchError: unknown) {
          const err = switchError as { code?: number };
          // Chain not added to MetaMask — add it
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [FACINET_CONFIG.networkParams],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWallet({
        address: accounts[0],
        chainId: FACINET_CONFIG.chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
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
    });
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

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

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener(
        'accountsChanged',
        handleAccountsChanged
      );
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect]);

  return { ...wallet, connect, disconnect };
}
