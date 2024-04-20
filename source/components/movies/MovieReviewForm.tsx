"use client";
import { errorHandler } from '@/source/controllers/SpecialCtrl';
import { Movie } from '@/source/models/Movie';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RingLoader } from 'react-spinners';

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

const MovieReviewForm = () => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [processing, setProcessing] = useState(false)

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!publicKey) return toast.error('Please connect your wallet to submit a review');
    if (processing) return toast.error('Please wait for the previous review to complete');

    if (title.trim().length < 1) return toast.error('Please enter a valid movie title');
    if (review.trim().length < 1) return toast.error('Please enter a valid review title');
    if (parseInt(rating) < 0 || parseInt(rating) > 5) return toast.error('Please enter a valid rating (0-5)');

    setProcessing(true)

    try {
      const movie = new Movie(title, parseInt(rating), review);
      const buffer = movie.serialize();
      const transaction = new web3.Transaction()

      const [pda] = web3.PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), Buffer.from(movie.title)],
        new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
      )

      const instruction = new web3.TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: false },
          { pubkey: pda, isSigner: false, isWritable: true },
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
        data: buffer
      })

      transaction.add(instruction);

      const txid = await sendTransaction(transaction, connection);
      toast.success(<p>
        Review submitted successfully.&nbsp;
        <a className='underline text-dark-blue' href={`https://explorer.solana.com/tx/${txid}?cluster=devnet`} target="_blank" rel="noopener noreferrer">View Transaction</a>
      </p>);
    } catch (error: any) {
      console.log(error)
      toast.error(errorHandler(error.message));
    }

    // Clear form fields
    setTitle(''); setReview(''); setRating('');
    setProcessing(false)
  };

  return (
    <div className="w-full max-w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Write a Movie Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Movie Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter movie title"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Movie Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            rows={5}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter rating (out of 5)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
            min={0}
            max={5}
            required
          />
        </div>
        <button type="submit" disabled={processing || !publicKey}
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue flex items-center">
          Submit Review
          {processing && <span className="ml-2">
            <RingLoader color="white" size={"16px"} />
          </span>}
        </button>
      </form>
    </div>
  );
};

export default MovieReviewForm;
