import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getPopularTVShows, getActionMovies} from "../services/movieService";

function Home() {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [
                    trendingData,
                    popularData,
                    topRatedData,
                    tvData,
                    actionData
                ] = await Promise.all([
                    getTrendingMovies(),
                    getPopularMovies(),
                    getTopRatedMovies(),
                    getPopularTVShows(),
                    getActionMovies()
                ]);

                setTrending(trendingData.results);
                setPopular(popularData.results);
                setTopRated(topRatedData.results);
                setTvShows(tvData.results);
                setActionMovies(actionData.results);

            } catch (err) {
                console.error("Failed to fetch movies:", err);
                setError("Unable to load movies. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const featuredMovie = trending.find((movie) => movie.backdrop_path) || trending[0];

    if (loading) {
        return <h2 className="loading">Loading movies...</h2>;
    }

    if (error) {
        return <h2 className="error">{error}</h2>;
    }

    return (
        <div>
            <Navbar />
            <Banner movie={featuredMovie} />

            <MovieRow title="Trending Now" movies={trending}/>

            <MovieRow title="Popular Movies" movies={popular}/>

            <MovieRow title="Top Rated Movies" movies={topRated}/>

            <MovieRow title="Popular TV Shows" movies={tvShows}  mediaType="tv"/>

            <MovieRow title="Action Movies" movies={actionMovies}/>
        </div>
    );
}

export default Home;