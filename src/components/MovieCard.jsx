import { useState, useEffect } from "react";
import { Play, Plus, ThumbsUp, Check } from "lucide-react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {addToMyList, removeFromMyList, isInMyList} from "../services/myListService";

function MovieCard({ movie, mediaType="movie"}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const title = movie.title || movie.name;
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: null;
    useEffect(() => {
        let cancelled = false;
        const checkSavedStatus = async () => {
            if (!currentUser) {
                setIsSaved(false);
                return;
            }
            try {const saved = await isInMyList(
                    currentUser.uid,
                    movie.id,
                    mediaType
                );
                if (!cancelled) {
                    setIsSaved(saved);
                }
            } catch (error) {
                console.error("Error checking My List:", error);
            }
        };
        checkSavedStatus();
        return () => {cancelled = true;};
    }, [currentUser, movie.id, mediaType]);

    const openDetails = () => {
        const detailsPath = `/details/${mediaType}/${movie.id}`;
        if (!currentUser) {
            navigate("/login", {
                state: { from: detailsPath }
            });
            return;
        }
        navigate(detailsPath);
    };

    const handleAddToList = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            navigate("/login");
            return;
        }
        if (saving) return;
        try {
            setSaving(true);
            if (isSaved) {
                await removeFromMyList(
                    currentUser.uid,
                    `${mediaType}_${movie.id}`
                );
                setIsSaved(false);
            } else {
                await addToMyList(
                    currentUser.uid,
                    movie,
                    mediaType
                );
                setIsSaved(true);
            }
        } catch (error) {
            console.error("My List operation failed:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="movie-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={openDetails}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={title}
                    className="movie-poster"
                    loading="lazy"
                />
            ) : (
                <div className="poster-placeholder">
                    Poster unavailable
                </div>
            )}

            {isHovered && (
                <div className="movie-hover-info">
                    <div className="movie-actions">
                        <button aria-label="Play" onClick={(e) => {e.stopPropagation();openDetails();}}>
                            <Play size={18} fill="currentColor" />
                        </button>

                        <button aria-label={isSaved ? "Remove from My List": "Add to My List"}
                            onClick={handleAddToList}
                            disabled={saving}>
                            {isSaved ? (<Check size={18} />
                            ) : (
                                <Plus size={18} />
                            )}
                        </button>

                        <button aria-label="Like" onClick={(e) => e.stopPropagation()}>
                            <ThumbsUp size={18} />
                        </button>
                    </div>

                    <h3>{title}</h3>

                    <p>
                        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default MovieCard;