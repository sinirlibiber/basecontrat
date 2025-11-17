import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppKitProvider } from '@/config/appkit';
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <AppKitProvider>
              
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
            </AppKitProvider>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "SmartNet Deploy Tool",
        description: "Seamlessly switch networks and deploy smart contracts on Base Mainnet and Sepolia. Includes WalletConnect and Farcaster integration, with easy deployment and verification steps.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_9f3b2945-4a32-4cea-8569-ee42e0f4fdd2-DTffpuvxjZopnUHp4X0IJ3jT5EtGBB","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"SmartNet Deploy Tool","url":"https://late-rhythm-645.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
