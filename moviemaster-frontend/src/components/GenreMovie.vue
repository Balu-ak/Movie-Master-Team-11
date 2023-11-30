<script setup>
import { ref, onMounted,defineProps } from "vue";
import MovieServices from "../services/MovieServices.js";
import MovieSlider from "../components/MovieSlider.vue";

const props = defineProps(["title", "id"]);

const movies = ref([]);

onMounted(async () => {
  try {
    const response = await MovieServices.getMoviesByGenre(props.id);
    movies.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div>
    <MovieSlider :title="title" :movies="movies" :genreId="props.id" />
  </div>
</template>
