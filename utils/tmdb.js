import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  // params: {
  //   api_key: TMDB_API_KEY,
  // },
});

export const fetchFromTMDB = async (endpoint, params = {}) => {
  // const url = `${TMDB_BASE_URL}${endpoint}`;
  const config = {
    params: { api_key: TMDB_API_KEY, ...params },
  };
  // const response = await axios.get(url, config);
  const response = await tmdbClient.get(endpoint, config);
  return response.data;
};

// Search movies by title
export const searchMovies = async (query, page = 1) => {
  // try {
    const res = await fetchFromTMDB('/search/movie', { query, page });
    return res;
  // } catch (err) {
  //   throw new Error('Failed to search movies');
  // }
};

// Get movie details by ID
export const getMovieById = async (movieId) => {
  // try {
    // const res = await tmdbClient.get(`/movie/${movieId}`);
    const res = await fetchFromTMDB(`/movie/${movieId}`);
    return res;
  // } catch (err) {
  //   throw new Error('Failed to fetch movie details');
  // }
};

// Get trending movies
export const fetchTrendingMovies = async (timeWindow = 'week', params) => {
  // try {
    const res = await fetchFromTMDB(`/trending/movie/${timeWindow}`, params);
    return res;
  // } catch (err) {
  //   throw new Error('Failed to get trending movies');
  // }
};

// Get top rated movies
export const fetchTopRatedMovies = async (params) => {
  // try {
    const res = await fetchFromTMDB(`/movie/top_rated`, params);
    return res;
  // } catch (err) {
  //   throw new Error('Failed to get top rated movies');
  // }
};