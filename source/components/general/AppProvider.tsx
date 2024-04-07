"use client"
import store from "@/source/store/store"
import { ReactNode, useMemo } from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import FetchAppData from "./FetchAppData"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import WalletConnectModal from "./WalletConnectModal"

const AppProvider = ({ children }: { children: ReactNode }) => {
	const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);

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