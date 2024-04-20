"use client";
import CreateMint from "@/source/components/token-program/CreateMint";
import CreateTokenAccount from "@/source/components/token-program/CreateTokenAccount";
import Loader from "@/source/components/token-program/Loader";
import MintTokens from "@/source/components/token-program/MintTokens";
import ProgramInfo from "@/source/components/token-program/ProgramInfo";
import { shortenWalletAddress } from "@/source/controllers/SpecialCtrl";
import { findOrCreateAssociatedTokenAccountTransaction, getAcountTokensBalance, getTokenAccountWithMint } from "@/source/controllers/web3.helpers";
import { getMint, Mint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, TokenAmount } from "@solana/web3.js";
import { useEffect, useRef, useState } from "react";

type stageType = "init" | "create-mint" | "create-token-account" | "mint-tokens" | "approve-delegate" | "transfer-tokens" | "revoke-delegate" | "burn" | "connect-wallet"

export default function Home() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [stage, setStage] = useState<stageType>("init")
  const stageRef = useRef(0)
  const [mint, setMint] = useState<Mint | undefined>(undefined)
  const [associatedTokenAddress, setAssociatedTokenAddress] = useState<PublicKey | undefined>(undefined)
  const tbs = useState<TokenAmount | undefined>(undefined)
  const [showProgramInfo, setShowProgramInfo] = useState(false)

  useEffect(() => {
    const process = async () => {
      stageRef.current += 1
      const currentStageRef = stageRef.current
      setStage("init")
      setMint(undefined)

      const mint = window.localStorage.getItem("mint");
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (currentStageRef !== stageRef.current) return

      if (!publicKey) {
        // console.log(publicKey)
        setStage("connect-wallet")
      } else if (!mint) {
        setStage("create-mint")
      } else {
        try {
          const mintPublicKey = new PublicKey(mint)
          const mintInfo = await getMint(connection, mintPublicKey)
          setMint(mintInfo)

          // Check if the user has an associated token account with the mint
          const { associatedTokenAddress, accountInfo } = await getTokenAccountWithMint({ connection, publicAddress: publicKey, mint: mintInfo })
          const tokenBalance = await getAcountTokensBalance({ connection, publicKey: associatedTokenAddress })
          if (!accountInfo) return setStage("create-token-account")
          setAssociatedTokenAddress(associatedTokenAddress)
          tbs[1](tokenBalance)
          setStage("mint-tokens")
        } catch (error) {
          setStage("create-mint")
        }
      }
    }
    process()
  }, [publicKey])

  const saveMint = (mint: Mint, withStage?: boolean) => {
    setMint(mint)
    window.localStorage.setItem("mint", mint.address.toBase58())
    if (withStage) setStage("create-token-account")
  }

  const saveTokenAddress = async (addr: PublicKey) => {
    if (!mint) throw new Error('Mint does not exist!')
    if (!publicKey) throw new Error('Please connect your wallet to create a token address')

    const { associatedTokenAddress, accountInfo } = await getTokenAccountWithMint({ connection, publicAddress: publicKey, mint: mint })
    const tokenBalance = await getAcountTokensBalance({ connection, publicKey: associatedTokenAddress })
    if (!accountInfo) throw new Error('Token account does not exist!')
    if (associatedTokenAddress.toBase58() !== addr.toBase58()) throw new Error('Token account does not match')
    setAssociatedTokenAddress(associatedTokenAddress)
    tbs[1](tokenBalance)
    setStage("mint-tokens")
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-5 text-sm sm:text-base">
      <div className="w-full flex items-center justify-center">
        {stage === "init" && <Loader text="Initializing" />}
        {stage === "connect-wallet" && <div>
          Connect your wallet to run the token program
        </div>}
        {stage === "create-mint" && <CreateMint saveMint={saveMint} />}
        {stage === "create-token-account" && <CreateTokenAccount mint={mint} saveTokenAddress={saveTokenAddress} />}
        {stage === "mint-tokens" && <MintTokens mint={mint} />}
      </div>
      <button onClick={() => setShowProgramInfo(true)} className="bg-[#9514ff] text-xs text-white px-2 py-1 rounded-md flex items-center shake">Program Info</button>
      {showProgramInfo && <ProgramInfo mint={mint} hideProgramInfo={() => setShowProgramInfo(false)} saveMint={saveMint} associatedTokenAddress={associatedTokenAddress} tbs={tbs} />}
    </main>
  );
}
