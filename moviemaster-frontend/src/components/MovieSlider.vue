<template>
  <section class="section-margin" style="margin-top: 50px; margin-right: 20px; margin-left: 20px;" v-if="props.movies.length > 0">
    <div class="d-flex align-items-center">
      <h2 style="margin-left: 20px; margin-top: 10px;">{{ title }}</h2>
      <button class="see-all-button" @click="seeAllMovies">See All</button>
    </div>
    <div class="scroll-container" style="margin-top: 30px;">
      <div class="d-flex">
        <router-link
          v-for="movie in props.movies"
          :key="movie.id"
          class="carousel-image"
          :to="{ name: 'movie', params: { id: movie.id } }"
        >
          <img :src="'/images/' + movie.imageUrl" :alt="movie.title" width="180" height="150" style="margin: 10px;" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(["title", "movies", "languageId", "genreId"]);

const randomMovies = ref([]);
const router = useRouter();

function seeAllMovies() {
  const queryParameters = props.languageId
    ? { languageId: props.languageId }
    : { genreId: props.genreId };

  router.push({ name: "movies", query: queryParameters });
}

</script>

<style scoped>
.see-all-button {
  background-color: red;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 20px;
}

.see-all-button:hover {
  background-color: rgb(237, 93, 93);
}

.scroll-container {
  overflow-x: auto;
  white-space: nowrap;
}

img {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s;
}

img:hover {
  transform: scale(1.3);
  z-index: 1;
}
</style>
