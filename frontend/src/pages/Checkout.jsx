import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const { user } = useAuth();
  const { items, priceFor, total, refresh } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a shipping address.");
      return;
    }
    if (paymentMethod === "CARD" && (!card.number.trim() || !card.expiry.trim() || !card.cvv.trim())) {
      setError("Please fill in your card details.");
      return;
    }
    if (paymentMethod === "UPI" && !upiId.trim()) {
      setError("Please enter your UPI ID.");
      return;
    }

    setError("");
    setPlacing(true);
    try {
      const paymentReference =
        paymentMethod === "CARD"
          ? `Card ending ${card.number.replace(/\s/g, "").slice(-4)}`
          : paymentMethod === "UPI"
          ? upiId
          : "GPay QR";

      const order = await orderService.checkout({
        shipping_address: address,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
      });
      await refresh();
      navigate("/orders", { state: { placedOrderId: order.id } });
    } catch {
      setError("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">Your cart is empty</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shipping Address
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="House no., street, city, state, PIN code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Method
            </Typography>
            <PaymentMethodSelector
              method={paymentMethod}
              onMethodChange={setPaymentMethod}
              card={card}
              onCardChange={setCard}
              upiId={upiId}
              onUpiIdChange={setUpiId}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={600}>{item.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.rental_plan.name} × {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontWeight={700}>{currency.format(priceFor(item))}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Summary
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{currency.format(total)}</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Total Payable
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary.dark">
                {currency.format(total)}
              </Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={placing}
              onClick={handlePlaceOrder}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
