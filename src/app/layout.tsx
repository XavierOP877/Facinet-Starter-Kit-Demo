import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Avalanche Team1 India | Genesis NFT Claim',
  description:
    'Claim your Avalanche Team1 India Genesis NFT on Avalanche Fuji Testnet. Connect Core Wallet, claim your NFT, and submit your transaction hash.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-white antialiased">{children}</body>
    </html>
  );
}
