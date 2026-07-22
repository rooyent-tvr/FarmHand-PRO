import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LoginIcon from "@mui/icons-material/Login";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { getSecurityInfo } from "../../services/securityService";

export default function SecurityCard() {
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState({
    email: "",
    emailVerified: false,
    lastSignIn: null,
  });

  useEffect(() => {
    loadSecurity();
  }, []);

  async function loadSecurity() {
    try {
      setLoading(true);

      const data = await getSecurityInfo();

      if (data) {
        setSecurity(data);
      }
    } catch (err) {
      console.error("Failed to load security information:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString();
  };

  const securityItems = [
    {
      title: "Email",
      value: security.email || "Unknown",
      color: "default",
      icon: <VerifiedUserIcon color="primary" />,
      chip: false,
    },
    {
      title: "Email Verification",
      value: security.emailVerified ? "Verified" : "Pending",
      color: security.emailVerified ? "success" : "warning",
      icon: security.emailVerified ? (
        <CheckCircleIcon color="success" />
      ) : (
        <WarningAmberIcon color="warning" />
      ),
      chip: true,
    },
    {
      title: "Password",
      value: "Protected",
      color: "success",
      icon: <LockIcon color="primary" />,
      chip: true,
    },
    {
      title: "Two-Factor Authentication",
      value: "Coming Soon",
      color: "default",
      icon: <SecurityIcon color="action" />,
      chip: true,
    },
  ];

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          mb={2}
        >
          <SecurityIcon color="primary" />

          <Typography variant="h6" fontWeight={700}>
            Security
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          Monitor the security of your FarmHand PRO account.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box
            sx={{
              py: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stack spacing={2}>
              {securityItems.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    {item.icon}

                    <Typography fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Stack>

                  {item.chip ? (
                    <Chip
                      label={item.value}
                      color={item.color}
                      size="small"
                    />
                  ) : (
                    <Typography
                      color="text.secondary"
                      fontWeight={500}
                    >
                      {item.value}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <LoginIcon color="action" />

                  <Typography>
                    Last Sign In
                  </Typography>
                </Stack>

                <Typography color="text.secondary">
                  {formatDate(
                    security.lastSignIn
                  )}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<LockIcon />}
                fullWidth
              >
                Change Password
              </Button>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
