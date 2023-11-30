import apiClient from "./services";

export default {
  getOrders(id) {
    return apiClient.get("orders/users/"+id);
  },
  addOrder(order) {
    return apiClient.post("orders", order);
  },
  deleteOrder(id) {
    return apiClient.delete("orders/"+id);
  },
  getOrderById(id){
    return apiClient.get("orders/"+ id);
  }
};
