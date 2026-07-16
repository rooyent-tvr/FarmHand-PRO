import {
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import {
  CheckCircle,
  ArrowForward,
  Warning,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function ActionCenter({
  tasks = [],
  onComplete,
}) {
  const navigate = useNavigate();

  const todayTasks = tasks.slice(0, 5);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>

        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
        >
          ⚡ Today's Action Centre
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Complete today's most important farm tasks.
        </Typography>

        <Stack spacing={2}>

          {todayTasks.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "#f7faf7",
              }}
            >
              <Typography variant="h6">
                🎉 You're all caught up!
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                No urgent tasks for today.
              </Typography>
            </Paper>
          )}

          {todayTasks.map((task) => (
            <Paper
              key={task.id}
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 3,
                transition: ".2s",
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack spacing={1}>

                  <Typography
                    fontWeight={700}
                  >
                    {task.title}
                  </Typography>

                  <Chip
                    size="small"
                    color="warning"
                    icon={<Warning />}
                    label={
                      task.module ||
                      "General"
                    }
                  />

                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={
                      <CheckCircle />
                    }
                    onClick={() =>
                      onComplete?.(task)
                    }
                  >
                    Complete
                  </Button>

                  <Button
                    variant="outlined"
                    endIcon={
                      <ArrowForward />
                    }
                    onClick={() =>
                      navigate("/planner")
                    }
                  >
                    Open
                  </Button>

                </Stack>

              </Stack>

            </Paper>
          ))}

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Button
          fullWidth
          variant="contained"
          color="success"
          endIcon={<ArrowForward />}
          onClick={() =>
            navigate("/planner")
          }
        >
          View All Planner Tasks
        </Button>

      </CardContent>
    </Card>
  );
}
