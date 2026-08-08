import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import CategoryTile from "../components/common/CategoryTile";
import ProductCard from "../components/product/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([categoryService.list(), productService.list({ featured: true })])
      .then(([categoryData, productData]) => {
        setCategories(categoryData);
        setFeatured(productData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner minHeight="80vh" />;

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #F3B871 0%, #E8963F 100%)",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h2" sx={{ color: "#fff", fontSize: { xs: 34, md: 48 }, mb: 2 }}>
                Furnish your home,
                <br />
                the flexible way.
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400, mb: 4 }}>
                Rent premium furniture &amp; appliances on Monthly, Quarterly or Yearly
                plans — no long-term commitment, no upfront cost.
              </Typography>
              <Button
                component={RouterLink}
                to="/categories"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#fff",
                  color: "primary.dark",
                  "&:hover": { bgcolor: "#FFF8EE" },
                }}
              >
                Start Renting
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 4, sm: 3, md: 2 }}>
              <CategoryTile category={category} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {featured.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4">Featured Furniture</Typography>
            <Button component={RouterLink} to="/categories" endIcon={<ArrowForwardIcon />}>
              View All
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {featured.slice(0, 8).map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
}
