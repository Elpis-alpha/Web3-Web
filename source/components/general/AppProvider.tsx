"use client";
import store from "@/source/store/store";
import { ReactNode, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import FetchAppData from "./FetchAppData";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import * as web3 from "@solana/web3.js";
import WalletConnectModal from "./WalletConnectModal";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { rpcType } from "@/source/__env";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = useMemo(() => {
    switch (rpcType) {
      case "localnet":
        return "http://127.0.0.1:8899";
      case "devnet":
        return web3.clusterApiUrl(WalletAdapterNetwork.Devnet);
      case "testnet":
        return web3.clusterApiUrl(WalletAdapterNetwork.Testnet);
      case "mainnet":
        return web3.clusterApiUrl(WalletAdapterNetwork.Mainnet);
      default:
        return rpcType;
    }
  }, []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
      new LedgerWalletAdapter(),
      new MathWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <Provider store={store}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
          <FetchAppData />
          <WalletConnectModal />
        </WalletProvider>
      </ConnectionProvider>
    </Provider>
  );
};
export default AppProvider;
