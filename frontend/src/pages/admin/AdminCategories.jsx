import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import { categoryService } from "../../services/categoryService";
import { resolveImageUrl } from "../../services/api";

const EMPTY_FORM = { name: "", slug: "", description: "", image_url: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    categoryService.list().then(setCategories).finally(() => setLoading(false));
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

  const openEditDialog = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
    });
    setError("");
    setDialogOpen(true);
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    try {
      if (editingId) {
        await categoryService.update(editingId, form);
      } else {
        await categoryService.create(form);
      }
      setDialogOpen(false);
      loadData();
    } catch {
      setError("Could not save category. Slug might already be in use.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Its products will also be removed.")) return;
    await categoryService.remove(id);
    loadData();
  };

  if (loading) return <LoadingSpinner minHeight="40vh" />;

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Categories ({categories.length})</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add Category
        </Button>
      </Stack>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={resolveImageUrl(category.image_url)}
                    alt={category.name}
                    sx={{ width: 44, height: 44 }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell sx={{ maxWidth: 320 }}>{category.description}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditDialog(category)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
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
                fullWidth
                label="Slug"
                helperText="URL-friendly identifier, e.g. living-room — also the image folder name"
                value={form.slug}
                onChange={handleChange("slug")}
              />
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
                label="Category Image"
                multiple={false}
                categorySlug={form.slug.trim()}
                images={form.image_url ? [form.image_url] : []}
                onChange={(images) => setForm({ ...form, image_url: images[0] || "" })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingId ? "Save Changes" : "Create Category"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
