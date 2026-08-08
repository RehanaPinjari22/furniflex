import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, rentalPlanId, quantity = 1) => {
    await cartService.add({ product_id: productId, rental_plan_id: rentalPlanId, quantity });
    await refresh();
  };

  const updateItem = async (itemId, payload) => {
    await cartService.update(itemId, payload);
    await refresh();
  };

  const removeItem = async (itemId) => {
    await cartService.remove(itemId);
    await refresh();
  };

  const clearCart = async () => {
    await cartService.clear();
    setItems([]);
  };

  const priceFor = (item) => {
    const field = {
      Monthly: "monthly_price",
      Quarterly: "quarterly_price",
      Yearly: "yearly_price",
    }[item.rental_plan.name];
    return item.product[field] * item.quantity;
  };

  const total = items.reduce((sum, item) => sum + priceFor(item), 0);

  return (
    <CartContext.Provider
      value={{ items, loading, refresh, addToCart, updateItem, removeItem, clearCart, priceFor, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
