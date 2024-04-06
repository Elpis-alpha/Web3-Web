import Link from "next/link"
import WalletButton from "./WalletButton"

const Header = () => {
  return (
    <nav className="w-full bg-[#fff]">
      <div className="py-6 px-8 w-full flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl text-dark-blue font-bold shake hover:text-dark-blue-hover">Web3.js</h1>
        </Link>
        <div className="">
          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
export default Header