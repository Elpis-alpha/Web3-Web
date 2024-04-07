"use client"
import store from "@/source/store/store"
import { ReactNode, useMemo } from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import FetchAppData from "./FetchAppData"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter, LedgerWalletAdapter, MathWalletAdapter, CoinbaseWalletAdapter } from "@solana/wallet-adapter-wallets"
import * as web3 from "@solana/web3.js"
import WalletConnectModal from "./WalletConnectModal"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

const AppProvider = ({ children }: { children: ReactNode }) => {
	const solanaNetwork = WalletAdapterNetwork.Devnet
	const endpoint = useMemo(() => web3.clusterApiUrl(solanaNetwork), [solanaNetwork])
  const wallets = useMemo(() => [
		new PhantomWalletAdapter(),
		new SolflareWalletAdapter(),
		new TrustWalletAdapter(),
		new LedgerWalletAdapter(),
		new MathWalletAdapter(),
		new CoinbaseWalletAdapter()
	], []);

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
	)
}
export default AppProvider