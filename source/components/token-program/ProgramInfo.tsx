import { capitalize, errorHandler, shortenNumber, shortenWalletAddress } from "@/source/controllers/SpecialCtrl"
import { getAcountTokensBalance } from "@/source/controllers/web3.helpers"
import { getMint, Mint } from "@solana/spl-token"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, TokenAmount } from "@solana/web3.js"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaTimes } from "react-icons/fa"
import { FaRotate } from "react-icons/fa6"
import { HashLoader } from "react-spinners"

type propType = {
  mint: Mint | undefined,
  hideProgramInfo: () => void,
  saveMint: (mint: Mint) => void,
  associatedTokenAddress: PublicKey | undefined
  tbs: [TokenAmount | undefined, Function]
}
const ProgramInfo = ({ mint, hideProgramInfo, saveMint, associatedTokenAddress, tbs }: propType) => {
  const net = 'devnet'
  const [refreshMint, setRefreshMint] = useState(false)
  const { connection } = useConnection()
  const [tokenBalance, setTokenBalance] = tbs

  const refreshTheMint = async () => {
    if (!mint) return toast.error('Mint does not exist!')
    if (refreshMint) return toast.error('Please wait for the previous refresh to complete')
    setRefreshMint(true)

    try {
      const mintInfo = await getMint(connection, mint.address)
      if (associatedTokenAddress) {
        const tokenBalance = await getAcountTokensBalance({ connection, publicKey: associatedTokenAddress })
        if (tokenBalance) setTokenBalance(tokenBalance)
      }
      saveMint(mintInfo)
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }
    setRefreshMint(false)
  }

  return (
    <div className="z-[40] py-20 px-5 fixed inset-0 bg-black/10 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl shadow w-full max-w-[500px] flex flex-col gap-3">
        <h4 className="text-xl font-semibold flex items-center gap-1.5">
          Program Info
          <span className="flex text-lg text-dark-blue">
            {refreshMint && <HashLoader color="#1D9BF0" size={"16px"} />}
            {!refreshMint && <button onClick={() => refreshTheMint()} className=""><FaRotate /></button>}
          </span>
        </h4>

        <div>
          <h5 className="font-medium">Network</h5>
          <p className="text-sm">{capitalize(net)}</p>
        </div>

        <div>
          <h5 className="font-medium">Mint</h5>
          {mint && <a href={`https://explorer.solana.com/address/${mint.address.toBase58()}?cluster=${net}`} target="_blank" rel="noopener noreferrer" className="text-sm text-dark-blue underline">
            {shortenWalletAddress(mint.address.toBase58(), 5, 5)}
          </a>}
          {!mint && <p className="text-sm">Mint not created!</p>}
        </div>

        <div>
          <h5 className="font-medium">Decimals</h5>
          {mint && <p className="text-sm">{mint.decimals}</p>}
          {!mint && <p className="text-sm">Mint not created!</p>}
        </div>

        <div>
          <h5 className="font-medium">Supply</h5>
          {mint && <p className="text-sm">{shortenNumber(parseInt((mint.supply).toString()) / 10 ** mint.decimals)}</p>}
          {!mint && <p className="text-sm">Mint not created!</p>}
        </div>

        <div>
          <h5 className="font-medium">User token address</h5>
          {associatedTokenAddress && <a href={`https://explorer.solana.com/address/${associatedTokenAddress.toBase58()}?cluster=${net}`} target="_blank" rel="noopener noreferrer" className="text-sm text-dark-blue underline">
            {shortenWalletAddress(associatedTokenAddress.toBase58(), 5, 5)}
          </a>}
          {!associatedTokenAddress && <p className="text-sm">Address does not exist!</p>}
        </div>

        <div>
          <h5 className="font-medium">User token balance</h5>
          {tokenBalance && <p className="text-sm">{shortenNumber(tokenBalance.uiAmount ?? 0)}</p>}
          {!tokenBalance && <p className="text-sm">Balance not loaded!</p>}
        </div>

        <button className="absolute top-3 right-3 flex items-center justify-center text-[red] text-xl shake" onClick={hideProgramInfo}><FaTimes /></button>
      </div>
    </div>
  )
}
export default ProgramInfo