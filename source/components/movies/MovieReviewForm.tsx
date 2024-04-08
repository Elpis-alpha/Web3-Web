"use client";
import { useState } from 'react';

const MovieReviewForm = () => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log({ title, review, rating });

    // Clear form fields
    setTitle('');
    setReview('');
    setRating('');
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
        <button type="submit" className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue-hover focus:outline-none focus:ring focus:border-dark-blue">Submit Review</button>
      </form>
    </div>
  );
};

export default MovieReviewForm;
