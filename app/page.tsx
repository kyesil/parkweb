"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { saveOffer, verifyOffer } from "./actions";

// This will be replaced by 'use cache' soon
export const dynamic = "force-static";



export default function Home() {
  const [formData, setFormData] = useState({
    domainName: "domain",
    email: "",
    amount: "100",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    // Mevcut domain adını al
    let currentDomain = "";
    if (typeof window !== "undefined") {
      currentDomain = window.location.hostname;
      setFormData((prev) => ({
        ...prev,
        domainName: currentDomain,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveOffer({
        domainName: formData.domainName,
        email: formData.email,
        amount: parseInt(formData.amount),
        message: formData.message,
      } as any);

      setVerifyDialogOpen(true);
      setSnackbar({
        open: true,
        message: "Please check your email for the verification code!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyOffer(verificationCode);
      setVerifyDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Offer verified successfully!",
        severity: "success",
      });
      // Formu temizle
      setFormData({
        domainName: "",
        email: "",
        amount: "100",
        message: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Invalid verification code. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: "background.paper" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Make an Offer for this Domain
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Domain Name"
            variant="outlined"
            required
            disabled={true}
            value={formData.domainName}
            onChange={(e) =>
              setFormData({ ...formData, domainName: e.target.value })
            }
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Your Email"
            type="email"
            variant="outlined"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Offer Amount"
            type="number"
            variant="outlined"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            variant="outlined"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Offer"}
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={verifyDialogOpen}
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setVerifyDialogOpen(false);
          }
        }}
      >
        <DialogTitle>Enter Verification Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Verification Code"
            fullWidth
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleVerifyCode} variant="contained">
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          bottom: { xs: 16, sm: 24 },
          "& .MuiAlert-root": {
            width: { xs: "90%", sm: "400px" },
            mx: "auto",
            fontSize: "1rem",
            "& .MuiAlert-icon": {
              fontSize: "2rem",
            },
          },
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
