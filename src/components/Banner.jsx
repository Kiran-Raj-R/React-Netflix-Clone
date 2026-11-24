import { Play, Info } from "lucide-react";
import "./Banner.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { requireAuth } from "../utils/requireAuth";

function Banner({ movie }) {
    if (!movie) {return null;}
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const openDetails = () => {
        requireAuth(currentUser, navigate, () => {
            navigate(`/details/${movie.media_type || "movie"}/${movie.id}`);
        });};

    const title = movie.title || movie.name;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : null;

    return (
        <section
            className="banner"
            style={
                backdropUrl
                    ? { backgroundImage: `url(${backdropUrl})` }
                    : {}
            }
        >
            <div className="banner-overlay">
                <div className="banner-content">
                    <h1>{title}</h1>
                    <p>{movie.overview}</p>
                    <div className="banner-buttons">
                        <button className="play-btn" onClick={openDetails}>
                            <Play size={20} fill="currentColor" />
                            Play
                        </button>
                        <button className="info-btn" onClick={openDetails}>
                            <Info size={20} />
                            More Info
                        </button>
                    </div>
                    <div className="banner-rating">
                        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner;