import { useEffect, useState } from 'react';
import { useAccount, useEnsName } from 'wagmi';
import { normalize } from 'viem/ens';
import { base } from 'wagmi/chains';

export function useBasename() {
  const { address, chainId } = useAccount();
  const [basename, setBasename] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: ensName } = useEnsName({
    address,
    chainId: base.id,
  });

  useEffect(() => {
    const fetchBasename = async (): Promise<void> => {
      if (!address) {
        setBasename(null);
        return;
      }

      setLoading(true);
      try {
        // ENS name from wagmi hook
        if (ensName && ensName.endsWith('.base.eth')) {
          setBasename(ensName);
        } else {
          setBasename(null);
        }
      } catch (error) {
        console.error('Error fetching basename:', error);
        setBasename(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBasename();
  }, [address, ensName]);

  return { basename, loading };
}
