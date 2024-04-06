"use client"
import { Oval } from "react-loader-spinner";

export default function Loading() {
	return <main className="flex-1 flex flex-col items-center justify-center gap-5 p-5">
		<Oval color='rgba(111, 0, 255, 0.6)' width={60} secondaryColor='rgba(111, 0, 255, 0.3)' />
	</main>
}