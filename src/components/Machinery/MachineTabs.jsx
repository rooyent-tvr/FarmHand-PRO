import { Tabs, Tab, Paper } from "@mui/material";

const tabs = [
  { label: "Information", value: "information" },
  { label: "Service History", value: "service" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Running Costs", value: "costs" },
  { label: "Notes", value: "notes" },
];

export default function MachineTabs({
  value,
  onChange,
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 3,
        overflowX: "auto",
      }}
    >
      <Tabs
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
    </Paper>
  );
}