import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-5 text-sm sm:text-base text-center">
      <h3 className="font-bold text-2xl">Hello there!</h3>
      <div className="flex flex-col gap-3 w-[80%] max-w-[300px]">
        <Link className="flex px-3 py-2 bg-light-blue-mid hover:bg-light-blue-hover shake justify-center rounded-md" href={"/p/ping-counter"}>Ping Counter</Link>
        <Link className="flex px-3 py-2 bg-light-blue-mid hover:bg-light-blue-hover shake justify-center rounded-md" href={"/p/send-sol"}>Send SOL</Link>
      </div>
    </main>
  );
}
