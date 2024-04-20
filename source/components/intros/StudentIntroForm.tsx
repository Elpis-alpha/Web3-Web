"use client";
import { errorHandler } from '@/source/controllers/SpecialCtrl';
import { StudentIntro } from '@/source/models/StudentIntro';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RingLoader } from 'react-spinners';

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

const StudentIntroForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false)

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!publicKey) return toast.error('Please connect your wallet to submit a message');
    if (processing) return toast.error('Please wait for the previous message to complete');

    if (name.trim().length < 1) return toast.error('Please enter a valid name');
    if (message.trim().length < 1) return toast.error('Please enter a valid message');

    setProcessing(true)

    try {
      const intro = new StudentIntro(name, message);
      const buffer = intro.serialize();
      const transaction = new web3.Transaction()

      const [pda] = web3.PublicKey.findProgramAddressSync(
        [publicKey.toBuffer()],
        new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
      )

      const instruction = new web3.TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: false },
          { pubkey: pda, isSigner: false, isWritable: true },
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID),
        data: buffer
      })

      transaction.add(instruction);

      const txid = await sendTransaction(transaction, connection);
      toast.success(<p>
        Introduction submitted successfully.&nbsp;
        <a className='underline text-dark-blue' href={`https://explorer.solana.com/tx/${txid}?cluster=devnet`} target="_blank" rel="noopener noreferrer">View Transaction</a>
      </p>);
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    // Clear form fields
    setName(''); setMessage('');
    setProcessing(false)
  };

  return (
    <div className="w-full max-w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Introduce yourself</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            rows={5}
            required
          />
        </div>
        <button type="submit" disabled={processing || !publicKey}
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center">
          Submit Introduction
          {processing && <span className="ml-2">
            <RingLoader color="white" size={"16px"} />
          </span>}
        </button>
      </form>
    </div>
  );
};

export default StudentIntroForm;
