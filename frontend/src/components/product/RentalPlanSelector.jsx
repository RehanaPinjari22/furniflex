import { Box, Stack, Typography } from "@mui/material";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const PLAN_PRICE_FIELD = {
  Monthly: "monthly_price",
  Quarterly: "quarterly_price",
  Yearly: "yearly_price",
};

export default function RentalPlanSelector({ plans, product, selectedPlanId, onChange }) {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
      {plans.map((plan) => {
        const price = product[PLAN_PRICE_FIELD[plan.name]];
        const selected = plan.id === selectedPlanId;
        return (
          <Box
            key={plan.id}
            onClick={() => onChange(plan.id)}
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              border: "1.5px solid",
              borderColor: selected ? "primary.main" : "divider",
              bgcolor: selected ? "primary.main" : "background.paper",
              color: selected ? "primary.contrastText" : "text.primary",
              px: 2.5,
              py: 1.5,
              minWidth: 128,
              textAlign: "center",
              transition: "all 0.15s ease",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              {plan.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: selected ? 0.95 : 0.7 }}>
              {currency.format(price)}
            </Typography>
            {plan.discount_percent > 0 && (
              <Typography variant="caption" sx={{ opacity: selected ? 0.85 : 0.6 }}>
                Save {plan.discount_percent}%
              </Typography>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
