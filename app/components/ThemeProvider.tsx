"use client";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); 
  let prefersDarkMode = true;
  if (typeof window !== "undefined") 
    prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")?.matches;


  // Tema oluştur
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#2196f3",
          },
          secondary: {
            main: "#f50057",
          },
          background: {
            default: prefersDarkMode ? "#121212" : "#f5f5f5",
            paper: prefersDarkMode ? "#1e1e1e" : "#ffffff",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
