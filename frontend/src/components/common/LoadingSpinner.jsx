import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner({ minHeight = "50vh" }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight={minHeight}>
      <CircularProgress color="primary" />
    </Box>
  );
}
