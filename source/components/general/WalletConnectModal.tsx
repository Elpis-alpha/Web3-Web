"use client"
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { setWalletShowModal } from "@/source/store/slice/walletSlice";
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const WalletConnectModal = () => {
  const dispatch = useAppDispatch()
  const { showModal } = useAppSelector(store => store.wallet)
  const closeWalletModal = () => dispatch(setWalletShowModal(false));
  const { wallets, select } = useWallet();

  const [walletIsConnecting, setWalletIsConnecting] = useState<string | undefined>(undefined)
  const [showMe, setShowMe] = useState(false)
  useEffect(() => { setShowMe(true) }, [])
  if (!showMe) return <></>;

  return (
    <div className={`fixed z-[80] inset-0 overflow-y-auto flex justify-center p-5 md:p-10 ${showModal ? 'flex' : 'hidden'}`}>
      <div className="z-20 max-w-[500px] bg-white rounded-lg px-4 py-8 my-auto overflow-auto max-h-[90%]">
        <h1 className="text-center w-full font-semibold text-balance">Select your preferred wallet provider on Solana to continue</h1>

        <div className="flex flex-col gap-3 py-5 m-auto w-full smm:w-[90%]">
          {wallets.filter(w => w.readyState !== "NotDetected").map(wallet => {
            const connectWallet = async () => {
              try {
                setWalletIsConnecting(wallet.adapter.name)
                await select(wallet.adapter.name)
                await wallet.adapter.connect();
                wallet.adapter.eventNames()
                setWalletIsConnecting(undefined)
                closeWalletModal();
              } catch (error: any) {
                if (typeof error?.message === 'string' && error?.message?.length > 0) {
                  toast.error(error.message)
                } else {
                  console.log(error)
                  toast.error("An error occurred while connecting wallet. Please try again.")
                }
                setWalletIsConnecting(undefined)
              }
            }

            return <div key={wallet.adapter.name + '-wcm'} onClick={walletIsConnecting ? undefined : connectWallet}
              className={"flex gap-2 items-center justify-between px-3 py-2.5 bg-light-blue rounded-md " + (walletIsConnecting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-light-blue-hover")}>
              <div className="flex gap-2 items-center">
                <img src={wallet.adapter.icon} alt="Ig" className="w-6 h-6" />
                <p>{wallet.adapter.name}</p>
              </div>
              {(walletIsConnecting !== wallet.adapter.name) && <p className="text-sm opacity-60">{wallet.readyState}</p>}
              {(walletIsConnecting === wallet.adapter.name) && <div className="w-6 h-6 p-0.5"><Oval width={20} height={20} color="black" /></div>}
            </div>
          })}

          <p className="text-center font-medium pt-1">Or install</p>

          <div className="flex flex-wrap gap-3 w-full">
            {wallets.filter(w => w.readyState === "NotDetected").map(wallet => {
              const installWallet = async () => {
                try {
                  setWalletIsConnecting(wallet.adapter.name)
                  await select(wallet.adapter.name)
                  await wallet.adapter.connect();
                  setWalletIsConnecting(undefined)
                  closeWalletModal();
                } catch (error: any) {
                  if (typeof error?.message === 'string' && error?.message?.length > 0) {
                    toast.error(error.message)
                  } else {
                    console.log(error)
                    toast.error("An error occurred while connecting wallet. Please try again.")
                  }
                  setWalletIsConnecting(undefined)
                }
              }

              return <div key={wallet.adapter.name + '-wcm'} onClick={walletIsConnecting ? undefined : installWallet}
                className={"flex gap-2 items-center justify-between px-3 py-2.5 bg-light-blue rounded-md " + (walletIsConnecting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-light-blue-hover")}>
                <div className="flex gap-2 items-center">
                  <img src={wallet.adapter.icon} alt="Ig" className="w-6 h-6" />
                  <p>{wallet.adapter.name}</p>
                </div>
              </div>
            })}
          </div>

          {wallets.length === 0 && <p className="text-center text-sm text-[red]/80 py-3">No wallet found.</p>}
        </div>

        <button className="mx-auto flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white shake" onClick={closeWalletModal}>
          Cancel
        </button>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity z-10" onClick={closeWalletModal}></div>
    </div>
  );
};

export default WalletConnectModal;