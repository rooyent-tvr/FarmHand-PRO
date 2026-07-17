import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { Favorite } from "@mui/icons-material";

function getScoreColor(score) {
  if (score >= 90) return "#2e7d32";
  if (score >= 75) return "#43a047";
  if (score >= 60) return "#f9a825";
  return "#d32f2f";
}

export default function FarmHealthScore({
  score = 100,
  status = "Excellent",
}) {
  const color = getScoreColor(score);

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Farm Health Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall farm condition
            </Typography>
          </Box>

          <Favorite sx={{ fontSize: 32, color }} />
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: `8px solid ${color}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{ color, lineHeight: 1 }}
            >
              {score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              /100
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color }}
          >
            {status}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Updated from live farm data
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
}
