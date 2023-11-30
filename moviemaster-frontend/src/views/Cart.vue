<template>
  <div style="margin: 50px">
    <div class="d-flex align-items-center">
      <h2 style="margin-left: 20px; margin-top: 10px;">My Cart</h2>
        <button class="place-order-button" @click="placeOrder" v-if="user != null && cartItems.length !== 0">Place Order</button>
    </div>
  <div v-if="cartItems.length === 0" class="no-items-message">
      <h3> There are no items in the Cart </h3>
    </div>
    <div style="margin-top: 50px;" v-else>
      <div class="container">
        <div class="card-deck">
          <div v-for="(cartItem, index) in cartItems" :key="index" class="card">
            <img :src="'/images/' + cartItem.imageUrl" class="card-img-top" alt="..." width="250" height="150">
            <div class="card-body">
              <h5 class="card-title">{{ cartItem.title }}</h5>
              <a href="#" class="btn btn-danger" @click="removeFromCart(index)">Remove</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import OrderServices from "../services/OrderServices"; 

const cartItems = ref(getCartItems());
const user = JSON.parse(localStorage.getItem("user"));

function getCartItems() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function removeFromCart(index) {
  cartItems.value.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
}

async function placeOrder() {
  try {
    const movieIds = cartItems.value.map(item => item.id);
    const userId = user.id;
    const totalCost = cartItems.value.reduce((total, item) => total + item.cost, 0); 
    const orderData = {
      movieIds,
      userId,
      totalCost
    };
    const response = await OrderServices.addOrder(orderData);
    console.log("Order placed successfully:", response);
    localStorage.removeItem("cart");
    cartItems.value = [];
  } catch (error) {
    console.error("Error placing order:", error);
  }
}
</script>


<style scoped>
.place-order-button {
  background-color: red;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 20px;
}

.place-order-button:hover {
  background-color: rgb(237, 93, 93);
}
  .card-deck {
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    width: calc(20% - 10px); /* Adjust width as needed */
    margin: 0 5px 20px;
  }

    .no-items-message {
    text-align: center;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>
