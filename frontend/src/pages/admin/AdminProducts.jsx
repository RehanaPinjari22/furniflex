import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploader from "../../components/admin/ImageUploader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { resolveImageUrl } from "../../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const EMPTY_FORM = {
  name: "",
  category_id: "",
  description: "",
  image_urls: [],
  monthly_price: "",
  quarterly_price: "",
  yearly_price: "",
  deposit: "",
  stock_qty: 10,
  is_featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([productService.list({}), categoryService.list()])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = async (product) => {
    const full = await productService.get(product.id);
    setEditingId(full.id);
    setForm({
      name: full.name,
      category_id: full.category_id,
      description: full.description,
      image_urls: full.image_urls,
      monthly_price: full.monthly_price,
      quarterly_price: full.quarterly_price,
      yearly_price: full.yearly_price,
      deposit: full.deposit,
      stock_qty: full.stock_qty,
      is_featured: full.is_featured,
    });
    setError("");
    setDialogOpen(true);
  };

  const handleChange = (field) => (e) => {
    const value = field === "is_featured" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const selectedCategorySlug = categories.find((c) => c.id === Number(form.category_id))?.slug || "";

  const handleSubmit = async () => {
    setError("");
    const payload = {
      name: form.name,
      category_id: Number(form.category_id),
      description: form.description,
      image_urls: form.image_urls,
      monthly_price: Number(form.monthly_price),
      quarterly_price: Number(form.quarterly_price),
      yearly_price: Number(form.yearly_price),
      deposit: Number(form.deposit || 0),
      stock_qty: Number(form.stock_qty || 0),
      is_featured: Boolean(form.is_featured),
    };

    try {
      if (editingId) {
        await productService.update(editingId, payload);
      } else {
        await productService.create(payload);
      }
      setDialogOpen(false);
      loadData();
    } catch {
      setError("Could not save product. Check all fields are filled correctly.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await productService.remove(id);
    loadData();
  };

  if (loading) return <LoadingSpinner minHeight="40vh" />;

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Products ({products.length})</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add Product
        </Button>
      </Stack>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Monthly</TableCell>
              <TableCell>Quarterly</TableCell>
              <TableCell>Yearly</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={resolveImageUrl(product.image_urls?.[0])}
                    alt={product.name}
                    sx={{ width: 44, height: 44 }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {categories.find((c) => c.id === product.category_id)?.name || "—"}
                </TableCell>
                <TableCell>{currency.format(product.monthly_price)}</TableCell>
                <TableCell>{currency.format(product.quarterly_price)}</TableCell>
                <TableCell>{currency.format(product.yearly_price)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditDialog(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <TextField fullWidth label="Name" value={form.name} onChange={handleChange("name")} />
            </Grid>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category_id}
                onChange={handleChange("category_id")}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
              />
            </Grid>
            <Grid size={12}>
              <ImageUploader
                label="Product Images"
                multiple
                categorySlug={selectedCategorySlug}
                images={form.image_urls}
                onChange={(images) => setForm({ ...form, image_urls: images })}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                type="number"
                label="Monthly Price"
                value={form.monthly_price}
                onChange={handleChange("monthly_price")}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                type="number"
                label="Quarterly Price"
                value={form.quarterly_price}
                onChange={handleChange("quarterly_price")}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                type="number"
                label="Yearly Price"
                value={form.yearly_price}
                onChange={handleChange("yearly_price")}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Deposit"
                value={form.deposit}
                onChange={handleChange("deposit")}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock Quantity"
                value={form.stock_qty}
                onChange={handleChange("stock_qty")}
              />
            </Grid>
            <Grid size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={handleChange("is_featured")}
                  id="is_featured"
                />
                <label htmlFor="is_featured">Featured product</label>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingId ? "Save Changes" : "Create Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
