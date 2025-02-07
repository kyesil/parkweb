'use client';
import { useState } from 'react';
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
} from '@mui/material';
import { saveOffer } from './actions';

// This will be replaced by 'use cache' soon
export const dynamic = 'force-static';

export default function Home() {
  const [formData, setFormData] = useState({
    domainName: '',
    email: '',
    amount: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Rastgele verification code oluştur
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Mail gönder
      const emailResponse = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode,
          domainName: formData.domainName,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send verification email');
      }

      // Teklifi veritabanına kaydet
      await saveOffer({
        domainName: formData.domainName,
        email: formData.email,
        amount: parseInt(formData.amount),
        message: formData.message,
        verificationCode,
      });

      setSnackbar({
        open: true,
        message: 'Verification code has been sent to your email!',
        severity: 'success',
      });

      // Formu temizle
      setFormData({
        domainName: '',
        email: '',
        amount: '',
        message: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Make an Offer for a Domain
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Domain Name"
            variant="outlined"
            required
            value={formData.domainName}
            onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Your Email"
            type="email"
            variant="outlined"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Offer Amount"
            type="number"
            variant="outlined"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Message (Optional)"
            multiline
            rows={4}
            variant="outlined"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
