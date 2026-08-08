import { createTheme } from "@mui/material/styles";

// Palette derived from the FurniFlex mobile reference: warm amber/mustard
// accents on a soft cream base (light) or warm charcoal base (dark),
// pill-shaped buttons, rounded cards.
const amber = {
  main: "#E8963F",
  dark: "#C97A2B",
  light: "#F3B871",
  contrastText: "#FFFFFF",
};

const PALETTES = {
  light: {
    mode: "light",
    primary: amber,
    secondary: { main: "#2B2B2B", contrastText: "#FFFFFF" },
    background: { default: "#FFF8EE", paper: "#FFFBF3" },
    text: { primary: "#2B2B2B", secondary: "#7A7368" },
    divider: "#F0E4D0",
    error: { main: "#D64545" },
    success: { main: "#3F9A5B" },
  },
  dark: {
    mode: "dark",
    primary: amber,
    secondary: { main: "#EDE6D8", contrastText: "#211C15" },
    background: { default: "#17140F", paper: "#211C15" },
    text: { primary: "#F5EFE4", secondary: "#B7AC9A" },
    divider: "#3A3226",
    error: { main: "#E57373" },
    success: { main: "#66BB6A" },
  },
};

export function createAppTheme(mode = "light") {
  const palette = PALETTES[mode] ?? PALETTES.light;

  return createTheme({
    palette,
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Inter", "Poppins", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingLeft: 22,
            paddingRight: 22,
            paddingTop: 10,
            paddingBottom: 10,
          },
          containedPrimary: {
            boxShadow: "none",
            "&:hover": { boxShadow: "0 6px 16px rgba(232, 150, 63, 0.35)" },
          },
          outlined: {
            borderWidth: 1.5,
            "&:hover": { borderWidth: 1.5 },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.35)"
                : "0 4px 20px rgba(43, 43, 43, 0.06)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "dark"
                ? "0 2px 12px rgba(0, 0, 0, 0.4)"
                : "0 2px 12px rgba(43, 43, 43, 0.06)",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },
    },
  });
}
