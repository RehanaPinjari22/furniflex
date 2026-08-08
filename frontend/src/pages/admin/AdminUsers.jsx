import { useEffect, useState } from "react";
import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/orderService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.users().then(setUsers).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner minHeight="40vh" />;

  return (
    <AdminLayout>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Users ({users.length})
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "—"}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString("en-IN")}</TableCell>
                <TableCell>
                  <Chip
                    label={user.is_admin ? "Admin" : "Customer"}
                    color={user.is_admin ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </AdminLayout>
  );
}
