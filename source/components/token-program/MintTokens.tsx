"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import { findOrCreateAssociatedTokenAccountForOthersTransaction, getTokenAccountWithMint, mintTokens } from "@/source/controllers/web3.helpers";
import { Mint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";

const MintTokens = ({ mint }: { mint: Mint | undefined }) => {
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [reciever, setReciever] = useState("");

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!publicKey) return toast.error('Please connect your wallet to submit a message');
    if (!mint) return toast.error('Mint does not exist!');
    if (processing) return toast.error('Please wait for the previous message to complete');

    if (isNaN(amount)) return toast.error('Please enter a valid amount');
    if (amount < 1) return toast.error('Please enter a valid amount');
    if (amount > 100000) return toast.error('Amount should not exceed 100000');
    setProcessing(true)

    try {
      const destination = reciever ? new PublicKey(reciever) : publicKey;
      const { accountInfo, associatedTokenAddress } = await getTokenAccountWithMint({ connection, publicAddress: destination, mint: mint });

      const transaction = new Transaction()
      if (!accountInfo) {
        console.log("Creating associated token account")
        const { transaction: createAssociatedTokenAccountTransaction } = await findOrCreateAssociatedTokenAccountForOthersTransaction({ payer: publicKey, mint: mint, owner: destination });
        transaction.add(createAssociatedTokenAccountTransaction)
      }

      const mintTransaction = await mintTokens({ mint: mint.address, destination: associatedTokenAddress, authority: publicKey, amount: amount * 10 ** mint.decimals });
      transaction.add(mintTransaction)

      await sendTransaction(transaction, connection);
      toast.success('Tokens minted successfully!');
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    // Clear form fields
    setAmount(0); setReciever(""); setProcessing(false)
  }

  return (
    <div className="w-full max-w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Mint tokens</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount === 0 ? "" : amount}
            min={1} max={100000}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            placeholder="Enter the amount of tokens to be minted e.g. 1000"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reciever" className="block text-sm font-medium text-gray-700 mb-1">Reciever SOL address</label>
          <input
            type="string"
            id="reciever"
            value={reciever}
            onChange={(e) => setReciever(e.target.value)}
            placeholder="Leave empty to mint to your own address"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
          />
        </div>
        <button type="submit" disabled={processing}
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center">
          Mint Tokens
          {processing && <span className="ml-2">
            <RingLoader color="white" size={"16px"} />
          </span>}
        </button>
      </form>
    </div>
  )
}
export default MintTokens