import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { Cloud } from "@mui/icons-material";

export default function WeatherSummary({ weather }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: 2 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Cloud sx={{ fontSize: 20, color: "info.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Weather
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {weather?.available ? (
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 32 }}>
                {weather.current?.icon || "☀️"}
              </Typography>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {weather.current?.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {weather.current?.condition}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                Wind: {weather.current?.windSpeed} km/h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Humidity: {weather.current?.humidity}%
              </Typography>
            </Stack>

            {weather.forecast?.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Tomorrow
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {weather.forecast[0]?.icon} {weather.forecast[0]?.temperature}°C — {weather.forecast[0]?.condition}
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Cloud sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Weather Unavailable
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Configure an API key to enable weather intelligence.
            </Typography>
          </Box>
        )}

      </CardContent>
    </Card>
  );
}
