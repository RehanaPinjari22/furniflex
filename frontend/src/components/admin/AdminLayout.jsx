import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";

const TABS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Users", to: "/admin/users" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const currentTab = TABS.some((tab) => tab.to === location.pathname) ? location.pathname : "/admin";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Panel
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {TABS.map((tab) => (
            <Tab key={tab.to} label={tab.label} value={tab.to} component={RouterLink} to={tab.to} />
          ))}
        </Tabs>
      </Paper>

      <Box>{children}</Box>
    </Container>
  );
}
