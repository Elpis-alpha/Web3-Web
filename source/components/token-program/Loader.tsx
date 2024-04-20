"use client";
import { RingLoader } from "react-spinners"

const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="flex items-center gap-3 flex-col text-dark-blue-hover">
      <RingLoader color="#1d60f0" size={"60px"} />
      {text && <span>{text}</span>}
    </div>
  )
}
export default Loader