<template>
  <div class="order-item">
    <h3>Order {{ order.id }}</h3>
    <p>Total Cost: {{ order.totalCost }}</p>
       <div class="container">
      <div class="row">
       
    <router-link
        v-for="movie in order.Movies"
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
const { props } = defineProps(["order"]);
</script>

<style scoped>
.order-item {
  margin-top: 30px;
  padding: 10px;
  border-radius: 5px;
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
