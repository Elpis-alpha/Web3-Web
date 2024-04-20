import { errorHandler } from "@/source/controllers/SpecialCtrl"
import { findOrCreateAssociatedTokenAccountTransaction } from "@/source/controllers/web3.helpers"
import { Mint } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useState } from "react"
import toast from "react-hot-toast"
import { RingLoader } from "react-spinners"

const CreateTokenAccount = ({ saveTokenAddress, mint }: { saveTokenAddress: (addr: PublicKey) => void, mint: Mint | undefined }) => {
  const [processing, setProcessing] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleButtonClick = async () => {
    if (!publicKey) return toast.error('Please connect your wallet to create a token address');
    if (!mint) return toast.error('Create a new mint before creating a token address');
    if (processing) return toast.error('Please wait for the previous transaction to complete');

    setProcessing(true)

    try {
      const { transaction, associatedTokenAddress } = await findOrCreateAssociatedTokenAccountTransaction({ payer: publicKey, mint })
      await sendTransaction(transaction, connection)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      saveTokenAddress(associatedTokenAddress)
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    setProcessing(false)
  }

  return (
    <div className="w-full max-w-[500px] text-center">
      <h2 className="text-xl font-semibold mb-4">Create your token address</h2>
      <button type="submit" disabled={processing} onClick={handleButtonClick}
        className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center mx-auto">
        Create token address
        {processing && <span className="ml-2">
          <RingLoader color="white" size={"16px"} />
        </span>}
      </button>
    </div>
  )
}
export default CreateTokenAccount