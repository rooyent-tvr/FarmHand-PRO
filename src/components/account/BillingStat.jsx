import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function BillingStat({
  title,
  value,
  subtitle,
  icon,
  color = "primary.main",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        transition: "all .2s ease",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>

            {icon && (
              <Typography
                component="span"
                sx={{
                  color,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
