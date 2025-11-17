'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, LogOut, ExternalLink } from 'lucide-react';
import { useBasename } from '@/hooks/useBasename';
import { base } from 'wagmi/chains';

export function WalletInfo(): JSX.Element {
  const { address, isConnected, chainId, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { basename, loading: basenameLoading } = useBasename();

  const { data: balanceData } = useBalance({
    address,
    chainId,
  });

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>Connect your wallet to deploy contracts on Base</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => open()} className="w-full">
            Connect Wallet
          </Button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Supports WalletConnect, Coinbase Wallet, and Farcaster
          </p>
        </CardContent>
      </Card>
    );
  }

  const isFarcaster = connector?.name === 'Farcaster';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connected Wallet
          </span>
          <Badge variant={isFarcaster ? 'secondary' : 'outline'}>
            {isFarcaster ? '🟣 Farcaster' : connector?.name}
          </Badge>
        </CardTitle>
        <CardDescription>Your wallet details and balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Address:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <a
                href={`${chainId === base.id ? 'https://basescan.org' : 'https://sepolia.basescan.org'}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {basename && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Basename:</span>
                <Badge variant="secondary" className="font-mono">
                  {basename}
                </Badge>
              </div>
            </>
          )}

          {balanceData && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Balance:</span>
                <span className="font-semibold">
                  {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                </span>
              </div>
            </>
          )}
        </div>

        <Button
          onClick={() => disconnect()}
          variant="outline"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
