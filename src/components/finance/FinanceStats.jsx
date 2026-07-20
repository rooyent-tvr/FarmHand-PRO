import { Grid } from "@mui/material";

import StatCard from "../ui/StatCard";

export default function FinanceStats({
  records = [],
}) {
  const income = records
    .filter(
      (record) =>
        record.category === "Income"
    )
    .reduce(
      (sum, record) =>
        sum + Number(record.amount || 0),
      0
    );

  const expenses = records
    .filter(
      (record) =>
        record.category === "Expense"
    )
    .reduce(
      (sum, record) =>
        sum + Number(record.amount || 0),
      0
    );

  const profit = income - expenses;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Total Income"
          value={formatCurrency(income)}
          icon="💰"
          color="#16A34A"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Total Expenses"
          value={formatCurrency(expenses)}
          icon="💸"
          color="#DC2626"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Net Profit"
          value={formatCurrency(profit)}
          icon={
            profit >= 0
              ? "📈"
              : profit < 0
              ? "📉"
              : "➖"
          }
          color={
            profit > 0
              ? "#16A34A"
              : profit < 0
              ? "#DC2626"
              : "#64748B"
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Transactions"
          value={records.length}
          icon="🧾"
          color="#F59E0B"
        />
      </Grid>
    </Grid>
  );
}
