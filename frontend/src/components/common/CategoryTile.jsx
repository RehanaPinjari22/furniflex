import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { resolveImageUrl } from "../../services/api";

export default function CategoryTile({ category }) {
  return (
    <Box
      component={RouterLink}
      to={`/categories/${category.slug}`}
      sx={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        transition: "transform 0.15s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid",
          borderColor: "background.paper",
          boxShadow: "0 4px 16px rgba(43,43,43,0.1)",
        }}
      >
        <Box
          component="img"
          src={resolveImageUrl(category.image_url)}
          alt={category.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="center">
        {category.name}
      </Typography>
    </Box>
  );
}
