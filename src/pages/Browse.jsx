import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { getMovieGenres, getTVGenres, discoverMovies, discoverTVShows} from "../services/movieService";
import "./Browse.css";

function Browse({ mediaType }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const selectedGenre = searchParams.get("genre") || "";
    const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
    const isMovie = mediaType === "movie";
    const pageTitle = isMovie ? "Movies" : "TV Shows";

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = isMovie
                    ? await getMovieGenres()
                    : await getTVGenres();

                setGenres(data.genres);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        };

        fetchGenres();
    }, [isMovie]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const data = isMovie
                    ? await discoverMovies(selectedGenre, currentPage)
                    : await discoverTVShows(selectedGenre, currentPage);
                setMovies(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error("Failed to fetch content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [isMovie, selectedGenre, currentPage]);

    const handleGenreChange = (e) => {
        const genreId = e.target.value;
        setSearchParams(
            genreId ? { genre: genreId } : {}
        );
    };

    const handlePageChange = (page) => {
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous);
            params.set("page", page);
            return params;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="browse-page">
            <Navbar />
            <main className="browse-container">
                <div className="browse-header">
                    <h1>{pageTitle}</h1>
                    <select value={selectedGenre} onChange={handleGenreChange} >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p className="browse-message">
                        Loading {pageTitle}...
                    </p>
                ) : movies.length === 0 ? (
                    <p className="browse-message">
                        No {pageTitle.toLowerCase()} found.
                    </p>
                ) : (
                    <>
                        <div className="browse-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    mediaType={mediaType}
                                />
                            ))}
                        </div>
                        
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default Browse;
