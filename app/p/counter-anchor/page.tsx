"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import {
  useWallet,
  useConnection,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import idl from "@/source/idl.json";
import { setupProvider } from "@/source/controllers/helpers";
import { AnchorCounter } from "@/source/other-types";

// const PROGRAM_ID = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
const PROGRAM_ID = "BwrG2igcW2byvkXDwzgELWQZbPZH6UEngvSNhw85JBE8";

export default function Home() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState<anchor.Program<AnchorCounter>>();
  const { publicKey, connected, signTransaction } = useWallet();
  const [counter, setCounter] = useState<anchor.web3.PublicKey>();

  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<"" | "init" | "add" | "sub">("");
  const [pageState, setPageState] = useState<"initialize" | "change">(
    "initialize"
  );
  const [succStr, setSuccStr] = useState<string | undefined>(undefined);

  useEffect(() => {
    let provider = setupProvider(connection, wallet);
    if (!provider) return;

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID);
    setProgram(program as anchor.Program<AnchorCounter>);
  }, [connection, wallet]);

  const initializeCounterHandler = async () => {
    if (!publicKey || !signTransaction)
      return toast.error("Wallet not connected!");
    if (!program || !wallet) return toast.error("Program not initialized!");
    setLoading("init");

    try {
      const counter = anchor.web3.Keypair.generate();
      // airDrop to the counter
      await connection.requestAirdrop(wallet.publicKey, 10 ** 9);
      setCounter(counter.publicKey);

      let bal = await connection.getBalance(wallet.publicKey);
      console.log("Wallet balance: ", bal / 10 ** 9);

      console.log("Counter address: ", counter.publicKey.toBase58());
      const sig = await program.methods
        .initialize()
        .accounts({
          counter: counter.publicKey,
          user: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          // systemAccount: anchor.web3.SystemProgram.programId,
        })
        .signers([counter])
        .rpc();

      setSuccStr(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      setPageState("change");
      toast.success("Counter initialized successfully!");
    } catch (error: any) {
      console.log(error);
      toast.error(errorHandler(error.message));
    }
    setLoading("");
  };

  const incrementCounterHandler = async () => {
    if (!publicKey || !signTransaction)
      return toast.error("Wallet not connected!");
    if (!program || !wallet) return toast.error("Program not initialized!");
    if (!counter) {
      setPageState("initialize");
      return toast.error("Counter not initialized!");
    }
    setLoading("add");

    try {
      const sig = await program.methods
        .increment()
        .accounts({
          counter: counter,
          user: wallet.publicKey,
        })
        .rpc();

      setSuccStr(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      toast.success("Counter incremented successfully!");

      await refetchCounter();
    } catch (error: any) {
      console.log(error);
      toast.error(errorHandler(error.message));
    }
    setLoading("");
  };

  const decrementCounterHandler = async () => {
    if (!publicKey || !signTransaction)
      return toast.error("Wallet not connected!");
    if (!program || !wallet) return toast.error("Program not initialized!");
    if (!counter) {
      setPageState("initialize");
      return toast.error("Counter not initialized!");
    }
    setLoading("sub");

    try {
      const sig = await program.methods
        .decrement()
        .accounts({
          counter: counter,
          user: wallet.publicKey,
        })
        .rpc();

      setSuccStr(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      toast.success("Counter decremented successfully!");

      await refetchCounter();
    } catch (error: any) {
      console.log(error);
      toast.error(errorHandler(error.message));
    }
    setLoading("");
  };

  const refetchCounter = async () => {
    if (!publicKey || !signTransaction)
      return toast.error("Wallet not connected!");
    if (!program || !wallet) return toast.error("Program not initialized!");
    if (!counter) {
      setPageState("initialize");
      return toast.error("Counter not initialized!");
    }
    const tt = toast.loading("Fetching counter value...");
    const counterAccount = await program.account.counter.fetch(counter);
    setCount(counterAccount.count.toNumber());
    toast.success("Counter value fetched successfully!", { id: tt });
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-5 text-sm sm:text-base">
      {pageState === "initialize" && (
        <>
          <h3 className="font-bold text-2xl">Initialize the counter</h3>
          <button
            className="pt-1.5 pb-2 px-5 bg-dark-blue text-white rounded-md shake flex items-center justify-center"
            onClick={initializeCounterHandler}
            disabled={!connected || loading !== ""}
          >
            Initialize
            {loading === "init" && (
              <span className="ml-2 flex">
                <ClipLoader color="white" size={"16px"} />
              </span>
            )}
          </button>
        </>
      )}
      {pageState === "change" && (
        <>
          <h3 className="font-bold text-2xl">Modify the counter</h3>
          <div className="flex items-center justify-center gap-2 py-3">
            <button
              className="pt-1.5 pb-2 px-5 bg-dark-blue text-white rounded-md shake flex items-center justify-center"
              onClick={incrementCounterHandler}
              disabled={!connected || loading !== ""}
            >
              Increment
              {loading === "add" && (
                <span className="ml-2 flex">
                  <ClipLoader color="white" size={"16px"} />
                </span>
              )}
            </button>
            <button
              className="pt-1.5 pb-2 px-5 bg-dark-blue text-white rounded-md shake flex items-center justify-center"
              onClick={decrementCounterHandler}
              disabled={!connected || loading !== ""}
            >
              Decrement
              {loading === "sub" && (
                <span className="ml-2 flex">
                  <ClipLoader color="white" size={"16px"} />
                </span>
              )}
            </button>
          </div>
          <p>Counter value: {count}</p>
        </>
      )}

      {succStr && (
        <p className="">
          View the last transaction on{" "}
          <a
            href={succStr}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-blue underline"
          >
            Solana Explorer
          </a>
        </p>
      )}
    </main>
  );
}
