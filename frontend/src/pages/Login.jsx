import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <ChairAltIcon sx={{ color: "primary.main", fontSize: 40 }} />
        <Typography variant="h5">Welcome back</Typography>
        <Typography variant="body2" color="text.secondary">
          Login to continue to FurniFlex
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
            <TextField
              type="email"
              label="Email"
              required
              value={form.email}
              onChange={handleChange("email")}
            />
            <TextField
              type="password"
              label="Password"
              required
              value={form.password}
              onChange={handleChange("password")}
            />
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
        Don't have an account?{" "}
        <Link component={RouterLink} to="/register" fontWeight={600}>
          Sign up
        </Link>
      </Typography>

      <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3 }} color="text.secondary">
        Demo customer: demo@furniflex.com / Demo@123
        <br />
        Demo admin: admin@furniflex.com / Admin@123
      </Typography>
    </Container>
  );
}
