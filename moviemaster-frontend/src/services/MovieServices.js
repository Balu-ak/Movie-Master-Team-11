import apiClient from "./services";

export default {
  getMovies() {
    return apiClient.get("movies");
  },
  getMovie(id) {
    return apiClient.get("movies/" + id);
  },
  addMovie(movie) {
    return apiClient.post("movies", movie);
  },
  updateMovie(movie) {
    return apiClient.put("movies/" + movie.id, movie);
  },
  deleteMovie(movieId) {
    return apiClient.delete("movies/" + movieId);
  },
  getMoviesByGenre(genreId) {
    return apiClient.get("movies?genre_id=" + genreId);
  },
  getMoviesByLanguage(languageId) {
    return apiClient.get("movies?language_id=" + languageId);
  },
  getMoviesByGenreAndLanguage(genreId, languageId) {
    if (genreId != "" && languageId != "")
      return apiClient.get(
        "movies?language_id=" + languageId + "&genre_id=" + genreId
      );
    else if (genreId != "") return this.getMoviesByGenre(genreId);
    else if (languageId != "") return this.getMoviesByLanguage(languageId);
    else return this.getMovies();
  },
  searchMovie(key) {
    return apiClient.get("movies?search=" + key);
  },
  getRecommendations() {
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id
      : null;
    if (userId && userId != "")
      return apiClient.get("movies/recommendations?user_id=" + userId);
    else return apiClient.get("movies/recommendations");
  },
};
