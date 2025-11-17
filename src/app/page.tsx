'use client'
import { WalletInfo } from '@/components/WalletInfo';
import { NetworkSelector } from '@/components/NetworkSelector';
import { ContractDeployer } from '@/components/ContractDeployer';
import { Rocket, Github } from 'lucide-react';
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function Home(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Base Contract Deployer
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Deploy smart contracts on Base Mainnet and Base Sepolia with one click. 
            Connect via WalletConnect, Coinbase Wallet, or Farcaster.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Learn about Base →
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://docs.reown.com/appkit/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Reown AppKit Docs →
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Network */}
          <div className="lg:col-span-1 space-y-6">
            <WalletInfo />
            <NetworkSelector />
          </div>

          {/* Right Column - Contract Deployer */}
          <div className="lg:col-span-2">
            <ContractDeployer />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <a
                href="https://github.com/base"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <Github className="h-4 w-4" />
                Base on GitHub
              </a>
              <a
                href="https://docs.base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                Base Documentation
              </a>
              <a
                href="https://www.warpcast.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                Farcaster
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Built with Reown AppKit, WalletConnect, and Base
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
