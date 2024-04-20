import { errorHandler } from "@/source/controllers/SpecialCtrl"
import * as token from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import { useState } from "react"
import toast from "react-hot-toast"
import { RingLoader } from "react-spinners"

const CreateMint = ({ saveMint }: { saveMint: (mint: token.Mint, ws?: boolean) => void }) => {
  const [decimals, setDecimals] = useState(0)
  const [processing, setProcessing] = useState(false)

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!publicKey) return toast.error('Please connect your wallet to submit a message');
    if (processing) return toast.error('Please wait for the previous message to complete');

    if (decimals < 1 || decimals > 9) return toast.error('Please enter a decimals number between 1 and 9');
    setProcessing(true)

    try {
      const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = web3.Keypair.generate();
      const programId = token.TOKEN_PROGRAM_ID

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: token.MINT_SIZE,
          lamports,
          programId
        }),
        token.createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          publicKey,
          publicKey,
          programId
        )
      );

      await sendTransaction(transaction, connection, { signers: [mintKeypair] });
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mint = await token.getMint(connection, new web3.PublicKey(mintKeypair.publicKey.toBase58()));
      saveMint(mint, true)
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    // Clear form fields
    setDecimals(0);
    setProcessing(false)
  };

  return (
    <div className="w-full max-w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Create a new mint</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="decimals" className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
          <input
            type="number"
            id="decimals"
            value={decimals === 0 ? "" : decimals}
            min={1} max={9}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
            placeholder="Enter the decimals number e.g. 4 for 4"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            required
          />
        </div>
        <button type="submit" disabled={processing}
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center">
          Create Mint
          {processing && <span className="ml-2">
            <RingLoader color="white" size={"16px"} />
          </span>}
        </button>
      </form>
    </div>
  )
}
export default CreateMint