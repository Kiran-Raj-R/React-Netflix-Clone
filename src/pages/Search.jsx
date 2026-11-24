
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/movieService";
import Pagination from "../components/Pagination";
import "./Search.css";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = async (e, page = 1) => {
        e.preventDefault();
        if (!query.trim()) return;
        try {
            setLoading(true);
            setSearched(true);
            const data = await searchMovies(query.trim(), page);
            setResults(
                data.results.filter(
                    (item) =>
                        item.media_type === "movie" ||
                        item.media_type === "tv"
                )
            );
            setCurrentPage(page);
            setTotalPages(Math.min(data.total_pages, 500));
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <Navbar />
            <main className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search movies and TV shows..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">
                        <SearchIcon size={20} />
                        Search
                    </button>
                </form>
                {loading && <p>Searching...</p>}
                {!loading && searched && results.length === 0 && (
                    <p className="no-results">
                        No movies or TV shows found.
                    </p>
                )}
                {!loading && results.length > 0 && (
                    <div className="search-results">
                        {results.map((movie) => (
                            <MovieCard
                                key={`${movie.media_type}_${movie.id}`}
                                movie={movie}
                                mediaType={movie.media_type}
                            />
                        ))}
                    </div>
                )}
                {!loading && results.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            handleSearch(
                                { preventDefault: () => {} },
                                page
                            );
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </main>
        </div>
    );
}

export default Search;
