"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import { burnTokensTransaction, findOrCreateAssociatedTokenAccountForOthersTransaction, getTokenAccountWithMint } from "@/source/controllers/web3.helpers";
import { Mint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";

const BurnTokens = ({ mint, goToTransfer, goToMint }: { mint: Mint | undefined, goToTransfer: Function, goToMint: Function }) => {
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);

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
      const { accountInfo, associatedTokenAddress } = await getTokenAccountWithMint({ connection, publicAddress: publicKey, mint: mint });

      const transaction = new Transaction()
      if (!accountInfo) {
        console.log("Creating associated token account")
        const { transaction: createAssociatedTokenAccountTransaction } = await findOrCreateAssociatedTokenAccountForOthersTransaction({ payer: publicKey, mint: mint, owner: publicKey });
        transaction.add(createAssociatedTokenAccountTransaction)
      }

      const burnTransaction = await burnTokensTransaction({ owner: publicKey, mint: mint.address, account: associatedTokenAddress, amount: amount * 10 ** mint.decimals });
      transaction.add(burnTransaction)

      await sendTransaction(transaction, connection);
      toast.success('Tokens burnt successfully!');
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    // Clear form fields
    setAmount(0); setProcessing(false)
  }

  return (
    <div className="w-full max-w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Burn tokens</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount === 0 ? "" : amount}
            min={1} max={100000}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            placeholder="Enter the amount of tokens to be burnt e.g. 1000"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            required
          />
        </div>
        <button type="submit" disabled={processing}
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center">
          Burn Tokens
          {processing && <span className="ml-2">
            <RingLoader color="white" size={"16px"} />
          </span>}
        </button>
      </form>
      <div className="flex gap-2 pt-3 items-center">
        <button onClick={() => goToMint()} className="text-sm text-dark-blue hover:underline">Mint tokens</button>
        <div className="h-[1px] w-4 mt-0.5 bg-dark-blue"></div>
        <button onClick={() => goToTransfer()} className="text-sm text-dark-blue hover:underline">Transfer tokens</button>
      </div>
    </div>
  )
}
export default BurnTokens