import { useEffect, useState } from "react";
import {
  Chip,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/orderService";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUSES = ["PLACED", "CONFIRMED", "DELIVERED", "RETURNED", "CANCELLED"];

const STATUS_COLORS = {
  PLACED: "info",
  CONFIRMED: "primary",
  DELIVERED: "success",
  RETURNED: "default",
  CANCELLED: "error",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    adminService.orders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await adminService.updateOrderStatus(orderId, status);
    loadData();
  };

  if (loading) return <LoadingSpinner minHeight="40vh" />;

  return (
    <AdminLayout>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Orders ({orders.length})
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.user?.name}
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {order.user?.email}
                  </Typography>
                </TableCell>
                <TableCell>{order.items.length} item(s)</TableCell>
                <TableCell>{currency.format(order.total_amount)}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    renderValue={(value) => (
                      <Chip label={value} size="small" color={STATUS_COLORS[value] || "default"} />
                    )}
                  >
                    {STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </AdminLayout>
  );
}
