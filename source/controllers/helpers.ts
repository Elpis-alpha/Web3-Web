import * as anchor from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const setupProvider = (
  connection: anchor.web3.Connection,
  wallet: AnchorWallet | undefined
) => {
  let provider: anchor.Provider;

  if (!wallet) return
  try {
    provider = anchor.getProvider();
  } catch {
    provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(provider);
  }

  if (!provider) {
    throw new Error("Provider not set up!");
  }

  return provider;
};
