import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Notes as NotesIcon,
  Build,
  CalendarMonth,
} from "@mui/icons-material";

import { format } from "date-fns";

export default function MachineNotes({ notes, serviceHistory = [] }) {
  const serviceNotes = serviceHistory.filter((s) => s.notes);

  return (
    <Stack spacing={3}>

      {/* Section 1: Machine Notes */}
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>

          <Typography variant="h6" fontWeight={700} gutterBottom>
            📝 Machine Notes
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {notes ? (
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {notes}
            </Typography>
          ) : (
            <Card
              variant="outlined"
              sx={{ borderRadius: 3, p: 3, textAlign: "center" }}
            >
              <NotesIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography color="text.secondary">
                No machine notes available.
              </Typography>
            </Card>
          )}

        </CardContent>
      </Card>

      {/* Section 2: Service Notes History */}
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>

          <Typography variant="h6" fontWeight={700} gutterBottom>
            🔧 Service Notes History
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {serviceNotes.length === 0 ? (
            <Card
              variant="outlined"
              sx={{ borderRadius: 3, p: 3, textAlign: "center" }}
            >
              <Build sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography color="text.secondary">
                No service notes recorded.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {serviceNotes.map((service) => (
                <Card
                  key={service.id}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Build fontSize="small" color="success" />
                        <Typography variant="subtitle2" fontWeight={700}>
                          {service.service_type}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(service.service_date), "dd MMM yyyy")}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {service.notes}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

        </CardContent>
      </Card>

    </Stack>
  );
}
