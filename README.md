# Base Contract Deployer 🚀

Base blockchain üzerinde smart contract deploy etmek için hazırlanmış bir Web3 uygulaması. **WalletConnect**, **Reown AppKit**, ve **Farcaster** desteği ile Base Mainnet ve Base Sepolia testnet'inde tek tıkla contract deployment yapabilirsiniz.

## ✨ Özellikler

- 🌐 **Base Mainnet** ve **Base Sepolia** ağları arası geçiş
- 🎯 Tek tıkla **Smart Contract** deployment
- 💎 **ERC20 Token** oluşturma
- 🔌 **WalletConnect** entegrasyonu (Reown AppKit ile)
- 🟣 **Farcaster** cüzdan girişi
- 🏷️ **Basename** (.base.eth) gösterimi
- 📱 Responsive ve modern UI

## 🛠️ Teknolojiler

- **Next.js 15** - React framework
- **Reown AppKit** (@reown/appkit) - WalletConnect v2 entegrasyonu
- **wagmi** - React Hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **ethers.js** - Ethereum interaction
- **TailwindCSS** - Styling
- **TypeScript** - Type safety

## 📦 Kurulum

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repo-url>
cd mini-app
\`\`\`

### 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
# veya
pnpm install
# veya
yarn install
\`\`\`

### 3. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
# veya
pnpm dev
# veya
yarn dev
\`\`\`

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🚀 Vercel'e Deploy

Bu proje Vercel'e direkt deploy edilebilir durumdadır:

### GitHub ile Deploy

1. Reponuzu GitHub'a push edin
2. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
3. "New Project" butonuna tıklayın
4. GitHub reponuzu seçin
5. Deploy butonuna tıklayın

### Vercel CLI ile Deploy

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## 🔗 Base Network RPC'leri

### Base Mainnet
- **Chain ID:** 8453
- **RPC URL:** https://mainnet.base.org
- **Explorer:** https://basescan.org
- **Currency:** ETH

### Base Sepolia (Testnet)
- **Chain ID:** 84532
- **RPC URL:** https://sepolia.base.org
- **Explorer:** https://sepolia.basescan.org
- **Currency:** ETH

### Alternatif RPC'ler

#### Base Mainnet
- https://base.llamarpc.com
- https://base.blockpi.network/v1/rpc/public
- https://base-mainnet.public.blastapi.io

#### Base Sepolia
- https://base-sepolia.blockpi.network/v1/rpc/public
- https://base-sepolia.public.blastapi.io

## 📝 Smart Contract Deployment

### Simple Storage Contract Deploy

1. Cüzdanınızı bağlayın (WalletConnect, Coinbase Wallet, veya Farcaster)
2. Base Mainnet veya Base Sepolia seçin
3. "Simple Storage" tab'ına gidin
4. "Deploy Simple Storage Contract" butonuna tıklayın
5. Cüzdanınızdan transaction'ı onaylayın

### ERC20 Token Deploy

1. Cüzdanınızı bağlayın
2. Ağ seçin (Base Mainnet veya Sepolia)
3. "ERC20 Token" tab'ına gidin
4. Token bilgilerini girin:
   - **Token Name:** Token adı (örn: "My Token")
   - **Token Symbol:** Token sembolü (örn: "MTK")
   - **Initial Supply:** Başlangıç arzı (örn: "1000000")
5. "Deploy ERC20 Token" butonuna tıklayın
6. Transaction'ı onaylayın

## ✅ Contract Verify (Doğrulama)

Contract deploy edildikten sonra, BaseScan'de verify etmek için:

### Basescan Web UI ile Verify

1. Deploy edilen contract adresini kopyalayın
2. [BaseScan](https://basescan.org) (Mainnet) veya [BaseScan Sepolia](https://sepolia.basescan.org) (Testnet)'e gidin
3. Contract adresini arama çubuğuna yapıştırın
4. "Contract" tab'ına gidin
5. "Verify and Publish" butonuna tıklayın
6. Aşağıdaki bilgileri girin:

#### Simple Storage Contract için:
- **Compiler Type:** Solidity (Single file)
- **Compiler Version:** v0.8.0
- **License:** MIT
- **Source Code:** `src/contracts/SimpleStorage.sol` dosyasının içeriğini yapıştırın

#### ERC20 Token için:
- **Compiler Type:** Solidity (Single file)
- **Compiler Version:** v0.8.0
- **License:** MIT
- **Constructor Arguments:** Token name, symbol ve supply'ı ABI encode edin
- **Source Code:** `src/contracts/ERC20Token.sol` dosyasının içeriğini yapıştırın

### Hardhat ile Verify (İleri Seviye)

\`\`\`bash
# hardhat.config.js oluşturun
npm install --save-dev hardhat @nomiclabs/hardhat-etherscan

# Verify komutu
npx hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
\`\`\`

## 🔑 WalletConnect Project ID

Uygulama **Reown AppKit** kullanıyor ve Project ID zaten konfigüre edilmiş durumda:

- **Project ID:** `8b0afcaf99464b72fe69705db84248f0`

Kendi Project ID'nizi kullanmak isterseniz:
1. [Reown Cloud](https://cloud.reown.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. `src/config/appkit.tsx` dosyasında `projectId` değişkenini güncelleyin

## 🟣 Farcaster Entegrasyonu

Uygulama Farcaster cüzdan bağlantısını destekler:

1. "Connect Wallet" butonuna tıklayın
2. Açılan modalde "Farcaster" seçeneğini seçin
3. Farcaster uygulamanızla QR kod'u tarayın veya doğrudan bağlanın
4. Başarılı girişte FID ve username otomatik olarak gösterilir

## 🏷️ Basename Desteği

Eğer cüzdanınızın bir **Basename** (.base.eth) varsa, otomatik olarak tespit edilir ve gösterilir.

## 📚 Kaynaklar

- [Base Documentation](https://docs.base.org)
- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [WalletConnect v2](https://walletconnect.com)
- [wagmi Documentation](https://wagmi.sh)
- [viem Documentation](https://viem.sh)
- [Farcaster](https://www.farcaster.xyz)

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açın.

## 📄 Lisans

MIT

---

**Built with ❤️ on Base**

*Keywords: base, walletconnect, reown, appkit, farcaster, blockchain, ethereum, smart-contract, web3*
