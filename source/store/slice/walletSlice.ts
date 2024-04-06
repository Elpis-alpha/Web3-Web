import { createSlice } from '@reduxjs/toolkit'

interface WalletState {
	available: boolean
	data?: {
	}
	tested: boolean
	loading: boolean
	showModal: boolean
}

const initialState: WalletState = {
	available: false,
	data: undefined,
	tested: false,
	loading: false,
	showModal: false
}

const WalletSlice = createSlice({
	name: "Wallet",
	initialState,
	reducers: {
		setWalletData: (state, { payload }) => {
			state.data = payload
			state.tested = true
			state.available = true
			state.loading = false
		},

		setWalletTest: (state, { payload }) => {
			state.tested = payload
			state.loading = false
		},

		setWalletLoading: (state, { payload }) => {
			state.loading = payload
		},

		setWalletShowModal: (state, { payload }) => {
			state.showModal = payload
		},

		removeWalletData: (state) => {
			state.data = undefined
			state.available = false
			state.loading = false
			state.tested = true
		},
	}
})
export default WalletSlice.reducer;
export const { setWalletData, setWalletTest, removeWalletData, setWalletLoading, setWalletShowModal } = WalletSlice.actions