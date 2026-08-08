import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    categoryService.list().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    productService
      .list({
        search: query || undefined,
        category_id: categoryId || undefined,
        sort,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [query, categoryId, sort, minPrice, maxPrice]);

  const handleQueryChange = (value) => {
    setSearchParams(value ? { q: value } : {});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {query ? `Search results for "${query}"` : "Search Furniture"}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
        <SearchBar value={query} onChange={handleQueryChange} placeholder="Search all furniture..." />
        <TextField
          select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          sx={{ minWidth: 170, bgcolor: "background.paper" }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
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

      {loading ? (
        <LoadingSpinner minHeight="40vh" />
      ) : products.length === 0 ? (
        <Typography color="text.secondary">No products found. Try a different search or filter.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
