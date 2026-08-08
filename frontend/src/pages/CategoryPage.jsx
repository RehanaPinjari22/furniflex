import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setLoading(true);
    categoryService
      .list()
      .then((categories) => {
        const found = categories.find((c) => c.slug === slug);
        setCategory(found || null);
        return productService.list({
          category_slug: slug,
          sort,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        });
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [slug, sort, minPrice, maxPrice]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, search]);

  if (loading) return <LoadingSpinner minHeight="70vh" />;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {category ? category.name : "Products"}
      </Typography>
      {category?.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {category.description}
        </Typography>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <SearchBar value={search} onChange={setSearch} placeholder={`Search in ${category?.name || "products"}...`} />
        <TextField
          type="number"
          label="Min ₹/month"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ minWidth: 140, bgcolor: "background.paper" }}
        />
        <TextField
          type="number"
          label="Max ₹/month"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ minWidth: 140, bgcolor: "background.paper" }}
        />
        <TextField
          select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 180, bgcolor: "background.paper" }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
        </TextField>
      </Stack>

      {filtered.length === 0 ? (
        <Typography color="text.secondary">No products found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
