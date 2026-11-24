import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMyList, removeFromMyList} from "../services/myListService";
import "./MyList.css";

function MyList() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyList = async () => {
            try {
                setLoading(true);
                const savedMovies = await getMyList(currentUser.uid);
                setMovies(savedMovies);
            } catch (err) {
                console.error("Failed to fetch My List:", err);
                setError("Unable to load your list. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyList();
    }, [currentUser]);

    const openDetails = (movie) => {
        navigate(`/details/${movie.mediaType}/${movie.id}`);
    };

    const handleRemove = async (e, movie) => {
        e.stopPropagation();
        try {
            await removeFromMyList(
                currentUser.uid,
                movie.documentId
            );
            setMovies((previousMovies) =>
                previousMovies.filter(
                    (item) => item.documentId !== movie.documentId
                )
            );
        } catch (err) {
            console.error("Failed to remove item:", err);
            setError("Unable to remove this title. Please try again.");
        }
    };

    return (
        <div className="my-list-page">
            <Navbar />
            <main className="my-list-container">
                <h1>My List</h1>
                {loading && (
                    <p className="my-list-message">Loading your list...</p>
                )}
                {error && (
                    <p className="my-list-error">{error}</p>
                )}
                {!loading && !error && movies.length === 0 && (
                    <div className="empty-list">
                        <h2>Your list is empty</h2>
                        <p>
                            Add movies and TV shows to your list
                            to watch them later.
                        </p>

                        <button onClick={() => navigate("/")}>
                            Explore Movies
                        </button>
                    </div>
                )}

                {!loading && movies.length > 0 && (
                    <div className="my-list-grid">
                        {movies.map((movie) => (
                            <div
                                className="my-list-card"
                                key={movie.documentId}
                                onClick={() => openDetails(movie)}
                            >
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="my-list-placeholder">
                                        Poster unavailable
                                    </div>
                                )}

                                <div className="my-list-info">
                                    <h3>{movie.title}</h3>

                                    <p>
                                        {movie.mediaType === "tv"
                                            ? "TV Show"
                                            : "Movie"}
                                    </p>

                                    <button
                                        onClick={(e) =>
                                            handleRemove(e, movie)
                                        }
                                        aria-label="Remove from My List"
                                        title="Remove from My List"
                                    >
                                        <Trash2 size={18} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyList;
