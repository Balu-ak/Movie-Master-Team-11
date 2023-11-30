<script setup>
import { defineProps, computed } from "vue";
import GenreMovie from "./GenreMovie.vue";
import LanguageMovie from "./LanguageMovie.vue";

const props = defineProps(["languagesMap", "genresMap"]);

const randomGenres = computed(() => {
  // Get random 4 genres
  const allGenres = Object.values(props.genresMap);
  const shuffledGenres = shuffleArray(allGenres);
  return shuffledGenres.slice(0, 4);
});

const randomLanguages = computed(() => {
  // Get random 4 languages
  const allLanguages = Object.values(props.languagesMap);
  const shuffledLanguages = shuffleArray(allLanguages);
  return shuffledLanguages.slice(0, 4);
});

function shuffleArray(array) {
  // Shuffle array to get random genres/languages
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
</script>

<template>
  <div>
    <div>
      <GenreMovie v-for="(genre, index) in randomGenres" :key="index" :title="genre" :id="index" />
    </div>
    <div>
      <LanguageMovie v-for="(language, index) in randomLanguages" :key="index" :title="language" :id="index" />
    </div>
  </div>
</template>
