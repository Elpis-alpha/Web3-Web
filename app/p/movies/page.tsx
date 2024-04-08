"use client";
import MovieReviewForm from "@/source/components/movies/MovieReviewForm";
import MovieReviewList from "@/source/components/movies/MovieReviewList";

export default function Home() {

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-20 text-sm sm:text-base">
      <MovieReviewForm />
      <MovieReviewList />
    </main>
  );
}
