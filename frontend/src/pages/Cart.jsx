import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { useCart } from "../context/CartContext";
import { rentalPlanService } from "../services/productService";
import { resolveImageUrl } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Cart() {
  const { items, loading, updateItem, removeItem, priceFor, total } = useCart();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    rentalPlanService.list().then(setPlans);
  }, []);

  if (loading) return <LoadingSpinner minHeight="70vh" />;

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Browse our categories and add furniture you'd love to rent.
        </Typography>
        <Button component={RouterLink} to="/categories" variant="contained" color="primary">
          Browse Furniture
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Your Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper key={item.id} sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Box
                    component="img"
                    src={resolveImageUrl(item.product.image_urls?.[0])}
                    alt={item.product.name}
                    sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 3 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currency.format(priceFor(item) / item.quantity)} / {item.rental_plan.name.toLowerCase()}
                    </Typography>
                  </Box>

                  <TextField
                    select
                    size="small"
                    label="Plan"
                    value={item.rental_plan.id}
                    onChange={(e) => updateItem(item.id, { rental_plan_id: Number(e.target.value) })}
                    sx={{ minWidth: 130 }}
                  >
                    {plans.map((plan) => (
                      <MenuItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                      onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 20, textAlign: "center" }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                      onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Typography variant="subtitle1" fontWeight={700} sx={{ minWidth: 90, textAlign: "right" }}>
                    {currency.format(priceFor(item))}
                  </Typography>

                  <IconButton color="error" onClick={() => removeItem(item.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{currency.format(total)}</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary.dark">
                {currency.format(total)}
              </Typography>
            </Stack>
            <Button fullWidth variant="contained" color="primary" size="large" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
