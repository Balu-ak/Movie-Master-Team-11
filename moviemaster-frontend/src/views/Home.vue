<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import MovieServices from "../services/MovieServices.js";
import LanguageServices from "../services/LanguageServices.js";
import GenreServices from "../services/GenreServices.js";
import MovieSliderList from "../components/MovieSliderList.vue";
import MovieSlider from "../components/MovieSlider.vue";

const newReleases = ref([]);
const recommendedMovies = ref([]);
const loader = ref(true);
const genresMap = ref({});
const languagesMap = ref({});

onMounted(async () => {
  await getNewReleases();
  await getRecommendedMovies();
  await getGenres();
  await getLanguages();
  loader.value = false;
});

async function getNewReleases() {
  try {
    const response = await MovieServices.getMovies();
    newReleases.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getRecommendedMovies() {
  try {
    const response = await MovieServices.getRecommendations();
    recommendedMovies.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getLanguages() {
  try {
    const response = await LanguageServices.getLanguages();
    languagesMap.value = response.data.reduce((acc, language) => {
      acc[language.id] = language.title;
      return acc;
    }, {});
  } catch (error) {
    console.error(error);
  }
}

async function getGenres() {
  try {
    const response = await GenreServices.getGenres();
    genresMap.value = response.data.reduce((acc, genre) => {
      acc[genre.id] = genre.title;
      return acc;
    }, {});
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div>
    <MovieSlider title="Recommendations" :movies="recommendedMovies" />
    <MovieSliderList
      :languagesMap="languagesMap"
      :genresMap="genresMap"
    />
  </div>
</template>

<style scoped>
</style>
