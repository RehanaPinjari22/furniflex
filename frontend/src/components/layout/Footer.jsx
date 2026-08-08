import { Box, Container, Grid, Link, Typography } from "@mui/material";
import ChairAltIcon from "@mui/icons-material/ChairAlt";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#211C15", color: "#fff", mt: 8, py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ChairAltIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" fontWeight={700}>
                FurniFlex
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Rent quality furniture &amp; appliances for your home, flexibly and affordably.
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
              Company
            </Typography>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8, mb: 0.5 }}>
              About Us
            </Link>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8, mb: 0.5 }}>
              Careers
            </Link>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8 }}>
              Contact
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
              Support
            </Typography>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8, mb: 0.5 }}>
              FAQs
            </Link>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8, mb: 0.5 }}>
              Terms &amp; Conditions
            </Link>
            <Link href="#" underline="hover" color="inherit" display="block" sx={{ opacity: 0.8 }}>
              Privacy Policy
            </Link>
          </Grid>
        </Grid>
        <Typography variant="caption" sx={{ display: "block", mt: 4, opacity: 0.6, textAlign: "center" }}>
          © {new Date().getFullYear()} FurniFlex. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.8, textAlign: "center", fontWeight: 600 }}>
          Built for a B.N.N College Project By Rehana Mansuri
        </Typography>
      </Container>
    </Box>
  );
}
