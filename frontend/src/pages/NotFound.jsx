import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2" color="primary.main" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h6">Page not found</Typography>
        <Button component={RouterLink} to="/" variant="contained" color="primary">
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
