import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import { toast } from "react-hot-toast";

import {
  getProfile,
  updateProfile,
} from "../../services/profileService";

export default function PreferencesCard() {
  const [loading, setLoading] = useState(true);

  const [preferences, setPreferences] = useState({
    weather_alerts: true,
    ai_recommendations: true,
    weekly_summary: true,
    email_notifications: true,
    sms_notifications: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const profile = await getProfile();

      if (!profile) return;

      setPreferences({
        weather_alerts: profile.weather_alerts ?? true,
        ai_recommendations: profile.ai_recommendations ?? true,
        weekly_summary: profile.weekly_summary ?? true,
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to load preferences.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(field) {
    const newValue = !preferences[field];

    setPreferences((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    try {
      await updateProfile({
        [field]: newValue,
      });

      toast.success("Preference saved");
    } catch (error) {
      console.error(error);

      toast.error("Failed to save preference");

      // Roll back if save fails
      setPreferences((prev) => ({
        ...prev,
        [field]: !newValue,
      }));
    }
  }

  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      key: "weather_alerts",
      label: "Weather Alerts",
    },
    {
      key: "ai_recommendations",
      label: "AI Recommendations",
    },
    {
      key: "weekly_summary",
      label: "Weekly Farm Summary",
    },
    {
      key: "email_notifications",
      label: "Email Notifications",
    },
    {
      key: "sms_notifications",
      label: "SMS Notifications",
    },
  ];

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Preferences
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Choose which notifications and smart features you want enabled.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {items.map((item) => (
            <FormControlLabel
              key={item.key}
              control={
                <Switch
                  checked={preferences[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              }
              label={item.label}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
