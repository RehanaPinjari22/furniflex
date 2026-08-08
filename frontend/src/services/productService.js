import { api } from "./api";

export const productService = {
  list: (params) => api.get("/products", { params }).then((res) => res.data),
  get: (id) => api.get(`/products/${id}`).then((res) => res.data),
  create: (payload) => api.post("/products", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const rentalPlanService = {
  list: () => api.get("/rental-plans").then((res) => res.data),
};
