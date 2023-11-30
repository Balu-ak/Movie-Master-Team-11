<template>
  <div>
    <div class="container">
      <div class="row">
         <div class="col-md-6">
         <h2>Movies</h2>
         </div>
        <div class="col-md-3">
          <select class="form-control" id="genreDropdown" v-model="selectedGenre">
            <option value="">Select Genre</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id" style="color: black;">{{ genre.name }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-control" id="languageDropdown" v-model="selectedLanguage">
            <option value="">Select Language</option>
            <option v-for="language in languages" :key="language.id" :value="language.id" style="color: black;">{{ language.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
       
            <router-link
        v-for="movie in movies"
        :key="movie.id"
        class="col-md-2 carousel-image"
        :to="{ name: 'movie', params: { id: movie.id } }"
      >
          <img :src="'/images/' + movie.imageUrl" width="200" height="150" />
            </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import MovieServices from "../services/MovieServices.js";
import GenreServices from "../services/GenreServices.js";
import LanguageServices from "../services/LanguageServices.js";
import { useRouter } from "vue-router";

const selectedGenre = ref("");
const selectedLanguage = ref("");
const movies = ref([]);
const genres = ref([]);
const languages = ref([]);
const router = useRouter();

onMounted(async () => {
  await getGenres();
  await getLanguages();
  
  // Check for query parameters on mount
  selectedGenre.value = router.currentRoute.value.query.genreId || "";
  selectedLanguage.value = router.currentRoute.value.query.languageId || ""; 
  // Fetch movies based on selected genre and language
  await getMovies();
});

watch([selectedGenre, selectedLanguage], async () => {
  updateRoute();
  await getMovies();
});

async function getLanguages() {
  try {
    const response = await LanguageServices.getLanguages();
    languages.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getMovies() {
  try {
    const response = await MovieServices.getMoviesByGenreAndLanguage(selectedGenre.value,selectedLanguage.value);
    movies.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getGenres() {
  try {
    const response = await GenreServices.getGenres();
    genres.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

function updateRoute() {
  const query = {};
  if (selectedGenre.value) query.genreId = selectedGenre.value;
  if (selectedLanguage.value) query.languageId = selectedLanguage.value;

  router.push({ query });
}

</script>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
}

.dropdown {
  margin-left: 20px;
}

img {
  border-radius: 5px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s;
}

img:hover {
  transform: scale(1.2);
}
</style>
