import { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28 }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Typography variant="h5">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Edit Profile
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField fullWidth label="Full Name" value={form.name} onChange={handleChange("name")} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Phone Number" value={form.phone} onChange={handleChange("phone")} />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Address"
              value={form.address}
              onChange={handleChange("address")}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" disabled={saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
