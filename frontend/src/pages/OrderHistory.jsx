import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { orderService } from "../services/orderService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUS_COLORS = {
  PLACED: "info",
  CONFIRMED: "primary",
  DELIVERED: "success",
  RETURNED: "default",
  CANCELLED: "error",
};

const PAYMENT_LABELS = {
  CARD: "Card",
  UPI: "UPI",
  GPAY_QR: "GPay QR",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.myOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner minHeight="70vh" />;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary">You haven't placed any orders yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
                <Chip
                  label={order.status}
                  color={STATUS_COLORS[order.status] || "default"}
                  size="small"
                />
              </Stack>

              <Stack spacing={1.5} divider={<Divider />}>
                {order.items.map((item) => (
                  <Stack key={item.id} direction="row" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.rental_plan.name} × {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight={600}>
                      {currency.format(item.price_at_order * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700} color="primary.dark">
                  {currency.format(order.total_amount)}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Shipping to: {order.shipping_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paid via {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                {order.payment_reference ? ` · ${order.payment_reference}` : ""}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
