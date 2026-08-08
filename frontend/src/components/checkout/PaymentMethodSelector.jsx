import { Box, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCode2Icon from "@mui/icons-material/QrCode2";

const METHODS = [
  { value: "CARD", label: "Credit / Debit Card", icon: <CreditCardIcon fontSize="small" /> },
  { value: "UPI", label: "UPI", icon: <AccountBalanceWalletIcon fontSize="small" /> },
  { value: "GPAY_QR", label: "GPay QR", icon: <QrCode2Icon fontSize="small" /> },
];

export default function PaymentMethodSelector({ method, onMethodChange, card, onCardChange, upiId, onUpiIdChange }) {
  return (
    <Box>
      <ToggleButtonGroup
        exclusive
        value={method}
        onChange={(_, value) => value && onMethodChange(value)}
        sx={{ mb: 3, flexWrap: "wrap" }}
      >
        {METHODS.map((m) => (
          <ToggleButton key={m.value} value={m.value} sx={{ gap: 1, px: 2.5 }}>
            {m.icon}
            {m.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {method === "CARD" && (
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            onChange={(e) => onCardChange({ ...card, number: e.target.value })}
          />
          <TextField
            fullWidth
            label="Name on Card"
            value={card.name}
            onChange={(e) => onCardChange({ ...card, name: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Expiry (MM/YY)"
              placeholder="12/28"
              value={card.expiry}
              onChange={(e) => onCardChange({ ...card, expiry: e.target.value })}
            />
            <TextField
              fullWidth
              label="CVV"
              placeholder="123"
              type="password"
              value={card.cvv}
              onChange={(e) => onCardChange({ ...card, cvv: e.target.value })}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Demo checkout — this is a simulated payment form for the college project and does not
            process any real transaction.
          </Typography>
        </Stack>
      )}

      {method === "UPI" && (
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="UPI ID"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => onUpiIdChange(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Demo checkout — enter any UPI ID. No real payment request is sent.
          </Typography>
        </Stack>
      )}

      {method === "GPAY_QR" && (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 2 }}>
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.default",
            }}
          >
            <QrCode2Icon sx={{ fontSize: 96, color: "text.secondary", opacity: 0.5 }} />
          </Box>
          <Typography variant="body2" fontWeight={600}>
            Scan with GPay or any UPI app
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Demo QR placeholder — no real transaction is made. Click "Place Order" once you've
            simulated the scan.
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
