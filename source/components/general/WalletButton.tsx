"use client"
import { copyText, shortenWalletAddress } from '@/source/controllers/SpecialCtrl'
import { useAppDispatch } from '@/source/store/hooks'
import { setWalletShowModal } from '@/source/store/slice/walletSlice'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCaretDown, FaCaretUp, FaCopy, FaTimes } from "react-icons/fa";
import { RingLoader } from 'react-spinners'

const WalletButton = () => {
  const dispatch = useAppDispatch()
  const [showWalletDropDown, setShowWalletDropDown] = useState(false)
  const { connected, connecting, disconnecting, publicKey, wallet, disconnect } = useWallet();

  const handleButtonClick = async () => {
    dispatch(setWalletShowModal(true))
  }
  const handleCopyAddress = () => {
    copyText(publicKey?.toBase58?.() ?? "")
    toast.success("Address copied to clipboard")
    setShowWalletDropDown(false)
  }
  const handleDisconnect = async () => {
    await disconnect()
    setShowWalletDropDown(false)
  }

  return (
    <>
      {(!connected && !disconnecting && !connecting) && <button className="py-1.5 sm:py-2 px-3 sm:px-5 bg-dark-blue text-white rounded-md shake" onClick={handleButtonClick}>
        Connect<span className='hidden sm:inline'> Wallet</span>
      </button>}
      {(connected && !disconnecting && !connecting) && <div className=''>
        <div className="py-1.5 sm:py-2 px-2.5 sm:px-4 bg-dark-blue text-white rounded-md cursor-pointer hover:bg-dark-blue-hover flex items-center gap-2" onClick={() => setShowWalletDropDown(p => !p)}>
          <span className='hidden sm:inline'>{shortenWalletAddress(publicKey?.toBase58?.(), 4, 3)}</span>
          <span className='inline sm:hidden'>{shortenWalletAddress(publicKey?.toBase58?.(), 2, 2)}</span>
          {showWalletDropDown ? <FaCaretUp /> : <FaCaretDown />}
        </div>
        {showWalletDropDown && <div className="absolute top-[110%] left-0 right-0 w-full bg-light-blue-mid rounded-md shadow-md z-[75] overflow-hidden text-xs sm:text-sm">
          <button className="py-1.5 sm:py-2 px-2.5 sm:px-4 flex items-center gap-2 hover:bg-light-blue-hover w-full" onClick={handleCopyAddress}>Copy <FaCopy /></button>
          <button className="py-1.5 sm:py-2 px-2.5 sm:px-4 hover:bg-light-blue-hover w-full overflow-hidden overflow-ellipsis break-keep text-left" onClick={handleDisconnect}>Disconnect</button>
        </div>}
      </div>}
      {(disconnecting || connecting) && <div className="py-2 sm:py-2.5 px-8 sm:px-14 bg-dark-blue text-white rounded-md cursor-wait">
        <RingLoader color="white" size={"20px"} />
        <button className="absolute inset-0 left-auto text-[white] shake flex items-center justify-center px-2 text-xl" onClick={handleDisconnect}><FaTimes /></button>
      </div>}
    </>
  )
}
export default WalletButton