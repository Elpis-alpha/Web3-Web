import { useEffect, useState } from "react"
import MovieReviewCard from "./MovieReviewCard"
import { Movie } from "@/source/models/Movie"
import { useConnection } from "@solana/wallet-adapter-react"
import { MovieCoordinator } from "@/source/models/MovieCoordinator"

const MovieReviewList = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const { connection } = useConnection()
  const [search, setSearch] = useState('')

  useEffect(() => {
    MovieCoordinator.fetchPage(
      connection,
      page,
      10,
      search,
      search !== ''
    ).then(setMovies)
  }, [page, search])

  return (
    <div className="flex flex-col w-full max-w-[500px] pt-10">
      <h2 className="text-xl font-semibold mb-4">Movie Reviews</h2>
      <div className="pb-3">
        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
          onChange={event => setSearch(event.currentTarget.value)}
        />
      </div>
      {movies.map((movie, i) => <MovieReviewCard key={movie.title + '-' + i} title={movie.title} rating={movie.rating} description={movie.description} />)}
      <div className="flex gap-3 items-center justify-center">
        {page > 1 && <button className="flex min-w-[110px] justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake" onClick={() => setPage(page - 1)}>Previous</button>}
        {MovieCoordinator.accounts.length > page * 2 &&
          <button className="flex min-w-[110px] justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake" onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </div>
  )
}
export default MovieReviewList