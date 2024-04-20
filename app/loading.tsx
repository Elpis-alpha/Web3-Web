"use client"
import { RingLoader } from "react-spinners";

export default function Loading() {
	return <main className="flex-1 flex flex-col items-center justify-center gap-5 p-5">
		<RingLoader color="rgba(111, 0, 255, 0.6)" size={"60px"} />
	</main>
}