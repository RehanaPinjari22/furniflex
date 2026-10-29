import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { productService, rentalPlanService } from "../services/productService";
import { resolveImageUrl } from "../services/api";
import RentalPlanSelector from "../components/product/RentalPlanSelector";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([productService.get(id), rentalPlanService.list()])
      .then(([productData, planData]) => {
        setProduct(productData);
        setPlans(planData);
        setSelectedPlanId(planData[0]?.id);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner minHeight="70vh" />;
  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, selectedPlanId, quantity);
      setToast(true);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={resolveImageUrl(product.image_urls?.[selectedImage])}
            alt={product.name}
            sx={{ width: "100%", height: 420, objectFit: "contain", borderRadius: 5, bgcolor: "grey.100" }}
          />
          {product.image_urls?.length > 1 && (
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              {product.image_urls.map((url, idx) => (
                <Box
                  key={url}
                  component="img"
                  src={resolveImageUrl(url)}
                  onClick={() => setSelectedImage(idx)}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: idx === selectedImage ? "primary.main" : "transparent",
                  }}
                />
              ))}
            </Stack>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {product.category && (
            <Typography variant="overline" color="primary.dark" fontWeight={700}>
              {product.category.name}
            </Typography>
          )}
          <Typography variant="h4" sx={{ mb: 2 }}>
            {product.name}
          </Typography>

          <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Security Deposit
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {currency.format(product.deposit)} <Typography component="span" variant="body2">(Refundable)</Typography>
              </Typography>
            </Box>
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Choose a rental plan
          </Typography>
          <RentalPlanSelector
            plans={plans}
            product={product}
            selectedPlanId={selectedPlanId}
            onChange={setSelectedPlanId}
          />

          <Typography variant="subtitle2" sx={{ mt: 4, mb: 1.5 }}>
            Quantity
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 24, textAlign: "center" }}>
              {quantity}
            </Typography>
            <IconButton
              onClick={() => setQuantity((q) => Math.min(product.stock_qty, q + 1))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="subtitle2" sx={{ mt: 4, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {product.description}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={adding}
            onClick={handleAddToCart}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={toast} autoHideDuration={2500} onClose={() => setToast(false)}>
        <Alert severity="success" variant="filled" onClose={() => setToast(false)}>
          Added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
}
