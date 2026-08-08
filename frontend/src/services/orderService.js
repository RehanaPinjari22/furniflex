import { api } from "./api";

export const orderService = {
  checkout: (payload) => api.post("/orders/checkout", payload).then((res) => res.data),
  myOrders: () => api.get("/orders").then((res) => res.data),
  get: (id) => api.get(`/orders/${id}`).then((res) => res.data),
};

export const adminService = {
  dashboard: () => api.get("/admin/dashboard").then((res) => res.data),
  users: () => api.get("/admin/users").then((res) => res.data),
  orders: () => api.get("/admin/orders").then((res) => res.data),
  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then((res) => res.data),
};
