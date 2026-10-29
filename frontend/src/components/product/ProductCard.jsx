import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { resolveImageUrl } from "../../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={resolveImageUrl(product.image_urls?.[0])}
          alt={product.name}
          sx={{ height: 200, objectFit: "contain", bgcolor: "grey.100" }}
        />
        {product.is_featured && (
          <Chip
            label="Featured"
            size="small"
            color="primary"
            sx={{ position: "absolute", top: 12, left: 12, fontWeight: 700 }}
          />
        )}
      </Box>
      <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {product.name}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 0.5, mb: 2 }}>
          <Typography variant="h6" color="primary.dark" fontWeight={700}>
            {currency.format(product.monthly_price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /month
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          component={RouterLink}
          to={`/products/${product.id}`}
          variant="outlined"
          color="primary"
          fullWidth
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
