"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const { publicKey, connected, signTransaction, sendTransaction } =
    useWallet();
  const [successString, setSuccessString] = useState<string | undefined>(
    undefined
  );
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState<string>("");

  const handleTransfer = async (e: any) => {
    e.preventDefault();
    if (!publicKey || !signTransaction)
      return toast.error("Wallet not connected!");
    setLoading(true);

    try {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) throw new Error("Invalid amount");

      const recipientPublicKey = new web3.PublicKey(recipientAddress);
      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPublicKey,
        lamports: web3.LAMPORTS_PER_SOL * amt,
      });

      const transaction = new web3.Transaction();
      transaction.add(sendSolInstruction);

      const sig = await sendTransaction(transaction, connection);
      setSuccessString(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    } catch (error: any) {
      console.log(error);
      toast.error(errorHandler(error.message));
    }
    setLoading(false);
  };

  const handleReset = () => {
    setRecipientAddress("");
    setAmount("");
    setSuccessString(undefined);
  };

  const handleRecipientAddressChange = (event: any) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-5 text-sm sm:text-base">
      {!successString && <h3 className="font-bold text-2xl">Send SOL</h3>}
      {!successString && (
        <form
          onSubmit={handleTransfer}
          className="max-w-[400px] w-full flex flex-col gap-3"
        >
          <div className="w-full">
            <label
              htmlFor="recipientAddress"
              className="block font-medium mb-1 text-sm"
            >
              Recipient Address:
            </label>
            <input
              required
              type="text"
              id="recipientAddress"
              value={recipientAddress}
              onChange={handleRecipientAddressChange}
              placeholder="Enter recipient address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full">
            <label htmlFor="amount" className="block font-medium mb-1 text-sm">
              Amount:
            </label>
            <input
              required
              step="any"
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount in SOL"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            className="bg-dark-blue hover:bg-dark-blue-hover text-white font-bold py-2 px-10 rounded mr-auto flex items-center justify-center"
            disabled={!connected || loading}
          >
            Send
            {loading && (
              <span className="ml-2 flex">
                <ClipLoader color="white" size={"16px"} />
              </span>
            )}
          </button>
        </form>
      )}

      {successString && (
        <h3 className="font-bold text-2xl text-[#29a325]">
          Transfer successful
        </h3>
      )}
      {successString && (
        <p className="">
          You can view the transaction on{" "}
          <a
            href={successString}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-blue underline"
          >
            Solana Explorer
          </a>
        </p>
      )}
      {successString && (
        <button
          className="mx-auto -mt-2 flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake"
          onClick={handleReset}
        >
          go back
        </button>
      )}
    </main>
  );
}
