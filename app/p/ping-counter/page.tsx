"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const { connection } = useConnection()
  const [loading, setLoading] = useState(false)
  const { publicKey, connected, signTransaction, sendTransaction } = useWallet()
  const [successString, setSuccessString] = useState<string | undefined>(undefined)

  const handlePing = async () => {
    if (!publicKey || !signTransaction) return toast.error('Wallet not connected!')
    setLoading(true)

    try {
      const programId = new web3.PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
      const pingProgramDataId = new web3.PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')
      const transaction = new web3.Transaction()

      const instruction = new web3.TransactionInstruction({
        keys: [
          { pubkey: pingProgramDataId, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: false },
        ],
        programId,
      })

      transaction.add(instruction)
      // const signature = await signTransaction(transaction)
      const signature = await sendTransaction(transaction, connection)
      setSuccessString(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }
    setLoading(false)
  }

  const handleReset = () => {
    setSuccessString(undefined)
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-5 text-sm sm:text-base">
      {!successString && <h3 className="font-bold text-2xl">Ping the program</h3>}
      {!successString && <button className="pt-1.5 pb-2 px-7 bg-dark-blue text-white rounded-md shake" onClick={handlePing} disabled={!connected || loading}>
        Ping
      </button>}

      {successString && <h3 className="font-bold text-2xl text-[#29a325]">Ping successful</h3>}
      {successString && <p className="">You can view the transaction on <a href={successString} target="_blank" rel="noopener noreferrer" className="text-dark-blue underline">Solana Explorer</a></p>}
      {successString && <button className="mx-auto -mt-2 flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake" onClick={handleReset}>
        go back
      </button>}
    </main>
  );
}
