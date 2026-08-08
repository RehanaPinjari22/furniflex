import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useThemeMode } from "../../context/ThemeModeContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { mode, toggleMode } = useThemeMode();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search${searchValue.trim() ? `?q=${encodeURIComponent(searchValue.trim())}` : ""}`);
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: "background.paper" }}>
      <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto" }}>
        {isMobile && (
          <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box
          component={RouterLink}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", flexGrow: isMobile ? 1 : 0 }}
        >
          <ChairAltIcon sx={{ color: "primary.main", fontSize: 32 }} />
          <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 }}>
            FurniFlex
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4, flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button key={link.to} component={RouterLink} to={link.to} color="inherit">
                {link.label}
              </Button>
            ))}
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ ml: 2, flexGrow: 1, maxWidth: 320 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search furniture..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ bgcolor: "background.default", borderRadius: 3 }}
              />
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: isMobile ? "auto" : 0 }}>
          {isMobile && (
            <IconButton component={RouterLink} to="/search" aria-label="search">
              <SearchIcon />
            </IconButton>
          )}

          <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <IconButton onClick={toggleMode} aria-label="toggle color mode">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          <IconButton component={RouterLink} to="/cart" aria-label="cart">
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchorEl(null)}>
                  Profile
                </MenuItem>
                <MenuItem component={RouterLink} to="/orders" onClick={() => setAnchorEl(null)}>
                  Order History
                </MenuItem>
                {user.is_admin && (
                  <MenuItem component={RouterLink} to="/admin" onClick={() => setAnchorEl(null)}>
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={RouterLink} to="/login" variant="contained" color="primary">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.to} component={RouterLink} to={link.to}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
