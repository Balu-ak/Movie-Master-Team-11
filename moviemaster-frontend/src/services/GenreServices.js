import apiClient from "./services";

export default {
  getGenres() {
    return apiClient.get("genres");
  },
  getGenre(id) {
    return apiClient.get("genres/" + id);
  },
  addGenre(genre) {
    return apiClient.post("genres", genre);
  },
  updateGenre(genre) {
    return apiClient.put("genres/" + genre.id, genre);
  },
  deleteGenre(genreId) {
    return apiClient.delete("genres/" + genreId);
  },
};
