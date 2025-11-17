'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NetworkSelector(): JSX.Element {
  const { chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const handleNetworkChange = (value: string): void => {
    const selectedChainId = parseInt(value);
    if (chainId !== selectedChainId) {
      switchChain({ chainId: selectedChainId });
    }
  };

  const currentNetwork = chainId === base.id ? 'base' : chainId === baseSepolia.id ? 'baseSepolia' : 'unknown';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Network Selection</CardTitle>
        <CardDescription>Choose between Base Mainnet and Base Sepolia testnet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="network">Active Network</Label>
          <Select
            value={currentNetwork}
            onValueChange={handleNetworkChange}
            disabled={isPending}
          >
            <SelectTrigger id="network">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">
                Base Mainnet (8453)
              </SelectItem>
              <SelectItem value="baseSepolia">
                Base Sepolia (84532)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {chainId && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Chain ID:</span>
              <span className="font-mono font-semibold">{chainId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Explorer:</span>
              <a
                href={chainId === base.id ? 'https://basescan.org' : 'https://sepolia.basescan.org'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {chainId === base.id ? 'basescan.org' : 'sepolia.basescan.org'}
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">RPC URL:</span>
              <span className="font-mono text-xs">
                {chainId === base.id ? 'https://mainnet.base.org' : 'https://sepolia.base.org'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
