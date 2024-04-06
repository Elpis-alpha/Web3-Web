import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import walletSlice from "./slice/walletSlice";

const store = configureStore({
	reducer: {
		user: userSlice,
		wallet: walletSlice,
	}
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch