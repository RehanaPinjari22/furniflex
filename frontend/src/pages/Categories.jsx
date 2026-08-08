import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { categoryService } from "../services/categoryService";
import CategoryTile from "../components/common/CategoryTile";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.list().then(setCategories).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner minHeight="70vh" />;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        All Categories
      </Typography>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid key={category.id} size={{ xs: 4, sm: 3, md: 2 }}>
            <CategoryTile category={category} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
