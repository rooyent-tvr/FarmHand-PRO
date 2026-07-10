import {
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";

export default function PageContainer({
  title,
  subtitle,
  children,
  fullWidth = false,
}) {
  return (
    <Container
      maxWidth={fullWidth ? false : "xl"}
      disableGutters={fullWidth}
      sx={{
        py: 4,
        px: fullWidth ? 4 : 2,
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ mb: 4 }}>
          {title && (
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                letterSpacing: "-0.5px",
              }}
            >
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 2,
                maxWidth: fullWidth ? "100%" : 900,
              }}
            >
              {subtitle}
            </Typography>
          )}

          <Divider />
        </Box>
      )}

      {children}
    </Container>
  );
}
