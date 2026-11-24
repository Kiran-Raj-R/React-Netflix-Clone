const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const fetchFromTMDB = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status}`);
    }

    return response.json();
};

export const getTrendingMovies = () => {
    return fetchFromTMDB("/trending/movie/week");
};

export const getPopularMovies = () => {
    return fetchFromTMDB("/movie/popular");
};

export const getTopRatedMovies = () => {
    return fetchFromTMDB("/movie/top_rated");
};

export const getPopularTVShows = () => {
    return fetchFromTMDB("/tv/popular");
};

export const getActionMovies = () => {
    return fetchFromTMDB("/discover/movie?with_genres=28");
};

export const getMovieDetails = (id) => {
    return fetchFromTMDB(
        `/movie/${id}?append_to_response=videos`
    );
};

export const getTVDetails = (id) => {
    return fetchFromTMDB(
        `/tv/${id}?append_to_response=videos`
    );
};

export const getMovieGenres = () =>
    fetchFromTMDB("/genre/movie/list");

export const getTVGenres = () =>
    fetchFromTMDB("/genre/tv/list");

export const discoverMovies = (genreId = "", page = 1) =>
    fetchFromTMDB(
        `/discover/movie?sort_by=popularity.desc&page=${page}${
            genreId ? `&with_genres=${genreId}` : ""
        }`
    );

export const discoverTVShows = (genreId = "", page = 1) =>
    fetchFromTMDB(
        `/discover/tv?sort_by=popularity.desc&page=${page}${
            genreId ? `&with_genres=${genreId}` : ""
        }`
    );

export const searchMovies = (query, page = 1) =>
    fetchFromTMDB(
        `/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );