import { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/orderService";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.dashboard().then(setStats);
  }, []);

  if (!stats) return <LoadingSpinner minHeight="40vh" />;

  const cards = [
    { label: "Total Products", value: stats.total_products },
    { label: "Total Categories", value: stats.total_categories },
    { label: "Total Users", value: stats.total_users },
    { label: "Total Orders", value: stats.total_orders },
    { label: "Total Revenue", value: currency.format(stats.revenue) },
  ];

  return (
    <AdminLayout>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.dark" sx={{ mt: 1 }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}
