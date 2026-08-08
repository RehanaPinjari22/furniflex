import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChairAltIcon from "@mui/icons-material/ChairAlt";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <ChairAltIcon sx={{ color: "primary.main", fontSize: 40 }} />
        <Typography variant="h5">Create your account</Typography>
        <Typography variant="body2" color="text.secondary">
          Join FurniFlex to start renting furniture
        </Typography>
      </Stack>

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2}>
            <TextField label="Full Name" required value={form.name} onChange={handleChange("name")} />
            <TextField type="email" label="Email" required value={form.email} onChange={handleChange("email")} />
            <TextField label="Phone Number" value={form.phone} onChange={handleChange("phone")} />
            <TextField
              type="password"
              label="Password"
              required
              helperText="At least 6 characters"
              value={form.password}
              onChange={handleChange("password")}
            />
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" fontWeight={600}>
          Login
        </Link>
      </Typography>
    </Container>
  );
}
