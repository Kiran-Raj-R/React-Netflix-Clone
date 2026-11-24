
import MovieCard from "./MovieCard";
import "./MovieRow.css";

function MovieRow({ title, movies, mediaType = "movie" }) {
    return (
        <section className="movie-row">
            <h2>{title}</h2>

            <div className="movie-list">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        mediaType={mediaType}
                    />
                ))}
            </div>
        </section>
    );
}

export default MovieRow;
