import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";

import { toast } from "react-hot-toast";
import { getProfile, updateProfile } from "../../services/profileService";

// ─────────────────────────────────────────────────────────────────────────────
// Default Preferences
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PREFERENCES = {
  weather: true,
  planner: true,
  animalHealth: true,
  breeding: true,
  crops: true,
  machinery: true,
  monthlyReports: true,
  billing: true,
  renewals: true,
  paymentFailures: true,
  loginAlerts: true,
  passwordChanged: true,
  newDevice: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: "Farm Operations",
    items: [
      { key: "weather", label: "Weather Alerts" },
      { key: "planner", label: "Planner Reminders" },
      { key: "animalHealth", label: "Animal Health Reminders" },
      { key: "breeding", label: "Breeding Reminders" },
      { key: "crops", label: "Crop Alerts" },
      { key: "machinery", label: "Machinery Service Reminders" },
    ],
  },
  {
    title: "Business",
    items: [
      { key: "monthlyReports", label: "Monthly Reports" },
      { key: "billing", label: "Billing Receipts" },
      { key: "renewals", label: "Subscription Renewals" },
      { key: "paymentFailures", label: "Payment Failures" },
    ],
  },
  {
    title: "Security",
    items: [
      { key: "loginAlerts", label: "Login Alerts" },
      { key: "passwordChanged", label: "Password Changed" },
      { key: "newDevice", label: "New Device Login" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function EmailNotificationPreferences() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const profile = await getProfile();
      if (profile?.email_notifications_prefs) {
        const saved = typeof profile.email_notifications_prefs === "string"
          ? JSON.parse(profile.email_notifications_prefs)
          : profile.email_notifications_prefs;
        setPrefs({ ...DEFAULT_PREFERENCES, ...saved });
      }
    } catch (err) {
      console.error("Failed to load notification preferences:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleToggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setDirty(true);
  }

  function handleEnableAll() {
    const allOn = {};
    for (const key of Object.keys(DEFAULT_PREFERENCES)) allOn[key] = true;
    setPrefs(allOn);
    setDirty(true);
  }

  function handleDisableAll() {
    const allOff = {};
    for (const key of Object.keys(DEFAULT_PREFERENCES)) allOff[key] = false;
    setPrefs(allOff);
    setDirty(true);
  }

  function handleResetDefaults() {
    setPrefs({ ...DEFAULT_PREFERENCES });
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ email_notifications_prefs: prefs });
      toast.success("Notification preferences saved.");
      setDirty(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <EmailIcon sx={{ color: "success.main" }} />
          <Typography variant="h6" fontWeight={700}>Email Notifications</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose which emails Feldrix should send you.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Categories */}
        <Stack spacing={3}>
          {CATEGORIES.map((category) => (
            <Stack key={category.title} spacing={1}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.7rem" }}>
                {category.title}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0.5 }}>
                {category.items.map((item) => (
                  <FormControlLabel
                    key={item.key}
                    control={
                      <Checkbox
                        checked={prefs[item.key]}
                        onChange={() => handleToggle(item.key)}
                        size="small"
                        sx={{ "&.Mui-checked": { color: "success.main" } }}
                      />
                    }
                    label={<Typography variant="body2">{item.label}</Typography>}
                  />
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckBoxIcon />}
            onClick={handleEnableAll}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5 }}
          >
            Enable All
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckBoxOutlineBlankIcon />}
            onClick={handleDisableAll}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5 }}
          >
            Disable All
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={handleResetDefaults}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5 }}
          >
            Reset Defaults
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={!dirty || saving}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5, px: 3 }}
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
