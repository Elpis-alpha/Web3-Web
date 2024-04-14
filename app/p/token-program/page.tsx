"use client";
import { errorHandler } from "@/source/controllers/SpecialCtrl";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
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
      const lamports = await token.getMinimumBalanceForRentExemptMint(connection)
      const accountKeyPair = web3.Keypair.generate()
      const programId = token.TOKEN_PROGRAM_ID

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
          fromPubkey: publicKey,
          lamports, programId,
          newAccountPubkey: accountKeyPair.publicKey,
          space: token.MINT_SIZE
        }),
        token.createInitializeMintInstruction(
          accountKeyPair.publicKey,
          5,
          publicKey,
          publicKey,
          programId
        )
      )

      setSuccessString(`cats`)
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
      Token program
    </main>
  );
}
