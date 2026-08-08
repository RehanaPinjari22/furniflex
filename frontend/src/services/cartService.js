import { api } from "./api";

export const cartService = {
  list: () => api.get("/cart").then((res) => res.data),
  add: (payload) => api.post("/cart", payload).then((res) => res.data),
  update: (itemId, payload) => api.put(`/cart/${itemId}`, payload).then((res) => res.data),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete("/cart"),
};
