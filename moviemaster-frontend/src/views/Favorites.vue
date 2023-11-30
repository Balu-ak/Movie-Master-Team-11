<template>
  <div style="margin: 50px">
    <h2>My Favorites</h2>
    <div v-if="favoriteItems.length === 0" class="no-items-message">
      <h3> There are no items in Favorites </h3>
    </div>
    <div style="margin-top: 50px;">
      <div class="container">
        <div class="card-deck">
          <div v-for="(favoriteItem, index) in favoriteItems" :key="index" class="card">
            <img :src="'/images/' + favoriteItem.imageUrl" class="card-img-top" alt="..." width="250" height="150">
            <div class="card-body">
              <h5 class="card-title">{{ favoriteItem.title }}</h5>
              <div style="display:flex">
              <button class="btn btn-danger" @click="addToCart(favoriteItem)">Add to Cart</button>
              <button class="btn btn-danger" @click="removeFromFavorites(index)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const favoriteItems = ref(getFavoriteItems());

function getFavoriteItems() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function removeFromFavorites(index) {
  favoriteItems.value.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favoriteItems.value));
}

function addToCart(item) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.push(item);
  localStorage.setItem("cart", JSON.stringify(cartItems));

  // removeFromFavorites(favoriteItems.value.indexOf(item));
}
</script>

<style scoped>
  .card-deck {
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    width: calc(20% - 10px); /* Adjust width as needed */
    margin: 0 5px 20px;
  }

  .btn {
    margin-right: 10px;
  }

  .no-items-message {
    text-align: center;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>
