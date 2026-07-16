import React from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";

import DayPlannerDialog from "./DayPlannerDialog";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Generate a full calendar grid for the given month.
 * Starts on Monday, ends on Sunday. Includes leading/trailing days
 * from adjacent months to fill complete weeks.
 */
function getCalendarDays(month) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  // getDay() returns 0 (Sun) - 6 (Sat). Convert to Mon-based: Mon=0 ... Sun=6
  const startDow = (getDay(start) + 6) % 7;
  const endDow = (getDay(end) + 6) % 7;

  // Leading days from previous month
  const calendarStart = addDays(start, -startDow);
  // Trailing days to fill out the last week (end on Sunday)
  const calendarEnd = addDays(end, 6 - endDow);

  const days = [];
  let current = calendarStart;
  while (current <= calendarEnd) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

export default function PlannerCalendar({ planner, onEdit, onComplete, onAddTask }) {
  const tasks = React.useMemo(
    () => [
      ...(planner.overdue || []),
      ...(planner.today || []),
      ...(planner.upcoming || []),
      ...(planner.completed || []),
    ],
    [planner]
  );

  const today = new Date();

  const [currentMonth, setCurrentMonth] = React.useState(today);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function getChipColor(module) {
    switch (module) {
      case "Animal Health":
        return "error";
      case "Breeding":
        return "success";
      case "Finance":
        return "primary";
      case "Crops":
        return "warning";
      case "Livestock":
        return "secondary";
      case "General":
        return "info";
      default:
        return "info";
    }
  }

  function handleDayClick(day) {
    setSelectedDate(day);
    setDialogOpen(true);
  }

  // Derive tasks for the selected day from current planner data (reactive)
  const selectedTasks = React.useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((task) => {
      if (!task.originalDate) return false;
      return isSameDay(new Date(task.originalDate), selectedDate);
    });
  }, [tasks, selectedDate]);

  // Auto-close dialog when no tasks remain for the selected day
  React.useEffect(() => {
    if (dialogOpen && selectedDate && selectedTasks.length === 0) {
      setDialogOpen(false);
    }
  }, [selectedTasks, dialogOpen, selectedDate]);

  const calendarDays = getCalendarDays(currentMonth);

  // Split into weeks (rows of 7)
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>
        {/* Calendar Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              ◀
            </Button>

            <Typography variant="h5" fontWeight={700}>
              📅 {format(currentMonth, "MMMM yyyy")}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              ▶
            </Button>
          </Stack>

          <Button
            variant="contained"
            color="success"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
        </Box>

        {/* Calendar Grid - scrollable on mobile */}
        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              minWidth: 700,
              gap: 0.5,
            }}
          >
            {/* Day-of-week headers */}
            {DAY_HEADERS.map((header) => (
              <Box
                key={header}
                sx={{
                  textAlign: "center",
                  py: 1,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {header}
              </Box>
            ))}

            {/* Calendar cells */}
            {weeks.flat().map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);

              const dayTasks = tasks.filter((task) => {
                if (!task.originalDate) return false;
                return isSameDay(new Date(task.originalDate), day);
              });

              return (
                <Box
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    height: 120,
                    overflow: "hidden",
                    border: isToday
                      ? "3px solid #2e7d32"
                      : "1px solid",
                    borderColor: isToday ? "#2e7d32" : "divider",
                    borderRadius: 2,
                    p: 0.75,
                    opacity: isCurrentMonth ? 1 : 0.35,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: 6,
                      bgcolor: "rgba(46,125,50,0.03)",
                      transform: "translateY(-3px)",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Day number */}
                  <Typography
                    fontWeight={700}
                    fontSize="1rem"
                    sx={{ lineHeight: 1.2, mb: 1 }}
                  >
                    {format(day, "d")}
                  </Typography>

                  {/* Task chips - max 2 visible */}
                  {dayTasks.length > 0 && (
                    <Stack spacing={0.3} sx={{ flex: 1, overflow: "hidden" }}>
                      {dayTasks.slice(0, 2).map((task) => (
                        <Chip
                          key={task.id}
                          size="small"
                          color={getChipColor(task.module)}
                          label={task.title}
                          sx={{
                            justifyContent: "flex-start",
                            fontWeight: 600,
                            fontSize: "0.6rem",
                            height: 22,
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      ))}

                      {dayTasks.length > 2 && (
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ fontWeight: 600, fontSize: "0.65rem" }}
                        >
                          +{dayTasks.length - 2} more
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>

      <DayPlannerDialog
        open={dialogOpen}
        selectedDate={selectedDate}
        tasks={selectedTasks}
        onClose={() => setDialogOpen(false)}
        onEdit={onEdit}
        onComplete={onComplete}
        onAddTask={onAddTask}
      />
    </Card>
  );
}
