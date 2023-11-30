<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import OrderServices from "../services/OrderServices.js";
import MovieServices from "../services/MovieServices.js";

const router = useRouter();
const id = router.currentRoute.value.params.id;
const movie = ref({});
const user = ref(JSON.parse(localStorage.getItem("user")));
const loader = ref(true);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getMovie();
  loader.value = false;
});

async function getMovie() {
  try {
    const response = await MovieServices.getMovie(id);
    movie.value = response.data;
    loader.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function addToFavorites() {
  if (!isInFavorites()) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(movie.value);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showSnackbar("green", "Added to Favorites!");
  } else {
    showSnackbar("info", "Already in Favorites!");
  }
}

async function addToCart() {
  if (!isInCart()) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(movie.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    showSnackbar("green", "Added to Cart!");
  } else {
    showSnackbar("info", "Already in Cart!");
  }
}

function isInFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((fav) => fav.id === movie.value.id);
}

function isInCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.some((cartItem) => cartItem.id === movie.value.id);
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function showSnackbar(color, text) {
  snackbar.value.value = true;
  snackbar.value.color = color;
  snackbar.value.text = text;
}
</script>

<template>
  <v-container>
    <Loading v-if="loader" />
    <div class="col-md-12 container elevation-5" v-else>
      <div class="row">
        <div class="col-md-5">
         <img :src="'/images/' + movie.imageUrl" class="large-image" />
        </div>
        <div class="col-md-7">
          <h2>{{ movie.title }}</h2>
          <p class="col-md-12">{{ movie.description }}</p>
          <b> Release Date : </b> <p> {{ movie.releaseDate.slice(0,10) }} </p>
          <b> Duration : </b> <p> {{ movie.duration }} Minutes </p>
          <b> Cost : </b> <p> $ {{ movie.cost }} </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <v-row justify="end">
            <v-btn
              class="button"
              @click="addToFavorites()"
              :disabled="isInFavorites()"
            >
              {{ isInFavorites() ? "Added to Favorites" : "Add To Favorites" }}
            </v-btn>
            <v-btn class="button" @click="addToCart()" :disabled="isInCart()">
              {{ isInCart() ? "Added to Cart" : "Add To Cart" }}
            </v-btn>
          </v-row>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.container {
  background: white;
  padding-bottom: 30px;
  color: black;
}
.row {
  margin-top: 20px;
  padding: 50px;
}
.large-image {
  width: 100%;
  max-height: 500px;
  border-radius: 5px;
}
.day-title {
  display: flex;
  padding: 20px;
  border: 1px black solid;
  border-radius: 5px;
}
.button {
  color: white;
  margin-right: 10px;
  background-color: #000000;
}
</style>
