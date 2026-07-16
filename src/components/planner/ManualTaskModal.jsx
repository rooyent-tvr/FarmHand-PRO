import {
  useEffect,
  useState,
} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const modules = [
  "General",
  "Livestock",
  "Animal Health",
  "Breeding",
  "Finance",
  "Crops",
];

const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const repeatOptions = [
  "None",
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

const initialForm = {
  title: "",
  description: "",
  module: "General",
  priority: "Medium",
  due_date: "",
  assigned_to: "",
  repeat_type: "None",
  repeat_until: "",
};

export default function ManualTaskModal({
  open,
  onClose,
  onSave,
  task = null,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.record?.description || "",
        module: task.module || "General",
        priority: task.priority || "Medium",
        due_date: task.record?.due_date || task.due_date || "",
        assigned_to: task.record?.assigned_to || "",
        repeat_type: task.record?.repeat_type || "None",
        repeat_until: task.record?.repeat_until || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose?.();
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }

    onSave?.({
      ...form,
      id: task?.id,
      completed: task?.record?.completed ?? false,
      source: "manual",
    });

    setForm(initialForm);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Typography
          component="div"
          variant="h5"
          fontWeight={700}
        >
          {task ? "✏️ Edit Task" : "➕ Create New Task"}
        </Typography>

        <Typography
          component="div"
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {task
            ? "Update an existing planner task."
            : "Add a new task to your Smart Farm Planner."}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="title"
              label="Task Title"
              placeholder="Repair fence"
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              placeholder="Describe the work..."
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              name="module"
              label="Module"
              value={form.module}
              onChange={handleChange}
            >
              {modules.map((module) => (
                <MenuItem
                  key={module}
                  value={module}
                >
                  {module}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              name="priority"
              label="Priority"
              value={form.priority}
              onChange={handleChange}
            >
              {priorities.map((priority) => (
                <MenuItem
                  key={priority}
                  value={priority}
                >
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              name="due_date"
              label="Due Date"
              value={form.due_date}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="assigned_to"
              label="Assigned To"
              placeholder="John"
              value={form.assigned_to}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              name="repeat_type"
              label="Repeat"
              value={form.repeat_type}
              onChange={handleChange}
            >
              {repeatOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              name="repeat_until"
              label="Repeat Until"
              value={form.repeat_until}
              onChange={handleChange}
              disabled={form.repeat_type === "None"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={!form.title.trim()}
          >
            {task ? "Update Task" : "Save Task"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
