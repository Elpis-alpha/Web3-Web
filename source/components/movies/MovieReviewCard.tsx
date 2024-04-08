import { Movie } from "@/source/models/Movie";

const MovieReviewCard = ({ title, rating, description }: Movie) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm mb-4">Rating: {rating}/5</p>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default MovieReviewCard;
