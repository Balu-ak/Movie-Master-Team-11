<template>
  <div class="container" style="margin-top:60px;">
    <h2>Your Orders</h2>
    <div v-if="loading">Loading orders...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="orders.length === 0 && !loading && !error">
      No orders found.
    </div>
    <div v-if="orders.length > 0 && !loading && !error">
      <OrderItem v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OrderServices from "../services/OrderServices";
import OrderItem from "../components/OrderItem.vue";

const orders = ref([]);
const loading = ref(true);
const error = ref(null);

const userId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).id
  : null;

onMounted(async () => {
  try {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    await getOrders();
    loading.value = false;
  } catch (err) {
    loading.value = false;
    error.value = "Error fetching orders.";
    console.error(err);
  }
});

async function getOrders() {
  try {
    const response = await OrderServices.getOrders(userId);
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
