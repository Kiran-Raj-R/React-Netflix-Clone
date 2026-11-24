import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import Navbar from "../components/Navbar";
import {getMovieDetails, getTVDetails} from "../services/movieService";
import "./MovieDetails.css";

function MovieDetails() {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    mediaType === "tv"
                        ? await getTVDetails(id)
                        : await getMovieDetails(id);

                setDetails(data);

                const videos = data.videos?.results || [];

                // Find an official YouTube trailer first
                const trailerVideo =
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer" &&
                            video.official
                    ) ||
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer"
                    ) ||
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Teaser"
                    );

                setTrailer(trailerVideo || null);

            } catch (err) {
                console.error(err);
                setError("Unable to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, mediaType]);

    if (loading) {
        return <h2 className="details-loading">Loading details...</h2>;
    }

    if (error || !details) {
        return <h2 className="details-error">
            {error || "Content not found"}
        </h2>;
    }

    const title = details.title || details.name;

    const backdrop = details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : "";

    const releaseDate =
        details.release_date || details.first_air_date;

    return (
        <div className="details-page">

            <Navbar />

            <div
                className="details-banner"
                style={
                    backdrop
                        ? { backgroundImage: `url(${backdrop})` }
                        : {}
                }
            >
                <div className="details-overlay">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>

                    <div className="details-content">

                        <h1>{title}</h1>

                        <div className="details-meta">
                            <span>
                                ⭐ {details.vote_average?.toFixed(1)}
                            </span>

                            {releaseDate && (
                                <span>
                                    {releaseDate.slice(0, 4)}
                                </span>
                            )}

                            {details.runtime && (
                                <span>{details.runtime} min</span>
                            )}

                            {details.number_of_seasons && (
                                <span>
                                    {details.number_of_seasons} Seasons
                                </span>
                            )}
                        </div>

                        <div className="details-genres">
                            {details.genres?.map((genre) => (
                                <span key={genre.id}>
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="details-overview">
                            {details.overview || "No description available."}
                        </p>

                    </div>
                </div>
            </div>

            <section className="trailer-section">

                <h2>
                    <Play size={22} />
                    Trailer & Preview
                </h2>

                {trailer ? (
                    <div className="trailer-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={`${title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className="no-trailer">
                        No trailer is currently available for this title.
                    </p>
                )}

            </section>

        </div>
    );
}

export default MovieDetails;