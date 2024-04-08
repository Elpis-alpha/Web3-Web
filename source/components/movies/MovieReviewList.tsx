import { useEffect, useState } from "react"
import MovieReviewCard from "./MovieReviewCard"
import { Movie } from "@/source/models/Movie"

const MovieReviewList = () => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    setMovies(Movie.mocks)
  }, [])

  return (
    <div className="flex flex-col w-full max-w-[500px] pt-10">
      <h2 className="text-xl font-semibold mb-4">Movie Reviews</h2>
      {movies.map((movie) => <MovieReviewCard key={movie.title} {...movie} />)}
    </div>
  )
}
export default MovieReviewList