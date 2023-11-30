import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/movies",
      name: "movies",
      component: () => import("./views/Movies.vue"),
    },
    {
      path: "/movie/:id",
      name: "movie",
      component: () => import("./views/Movie.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("./views/Cart.vue"),
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("./views/Favorites.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("./views/Orders.vue"),
    },
  ],
});

export default router;
