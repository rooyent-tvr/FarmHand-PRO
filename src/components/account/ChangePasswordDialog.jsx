import { useState, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// Password Validation Rules
// ─────────────────────────────────────────────────────────────────────────────

const RULES = [
  { key: "length", label: "8+ characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "Number", test: (p) => /\d/.test(p) },
  { key: "special", label: "Special character", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

function getStrength(password) {
  if (!password) return { level: 0, label: "", color: "grey.300" };
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed <= 1) return { level: 20, label: "Weak", color: "error.main" };
  if (passed <= 2) return { level: 40, label: "Fair", color: "warning.main" };
  if (passed <= 3) return { level: 60, label: "Good", color: "info.main" };
  if (passed === 4) return { level: 80, label: "Strong", color: "success.light" };
  return { level: 100, label: "Strong", color: "success.main" };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ChangePasswordDialog({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);
  const allRulesPassed = RULES.every((r) => r.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && allRulesPassed && passwordsMatch && !saving;

  function handleClose() {
    if (saving) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");

    try {
      // Re-authenticate with current password first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Session expired. Please log in again.");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setError("Current password is incorrect.");
        setSaving(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password.");
        setSaving(false);
        return;
      }

      toast.success("Password updated successfully.");
      handleClose();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4 } }}
      aria-labelledby="change-password-title"
    >
      <DialogTitle id="change-password-title" sx={{ pt: 4, px: 4, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LockIcon sx={{ color: "success.main", fontSize: 28 }} />
          <Stack spacing={0}>
            <Typography variant="h6" fontWeight={700}>Change Password</Typography>
            <Typography variant="body2" color="text.secondary">Update your account password securely.</Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Current Password */}
          <TextField
            fullWidth
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            size="small"
            aria-label="Current password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? "Hide current password" : "Show current password"}
                    tabIndex={-1}
                  >
                    {showCurrent ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            size="small"
            aria-label="New password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? "Hide new password" : "Show new password"}
                    tabIndex={-1}
                  >
                    {showNew ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Strength Meter */}
          {newPassword.length > 0 && (
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">Password Strength</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ color: strength.color }}>{strength.label}</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={strength.level}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { bgcolor: strength.color, borderRadius: 3 },
                }}
              />

              {/* Requirements */}
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5, mt: 0.5 }}>
                {RULES.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <Stack key={rule.key} direction="row" spacing={0.5} alignItems="center">
                      {passed ? (
                        <CheckCircleIcon sx={{ fontSize: 14, color: "success.main" }} />
                      ) : (
                        <CancelIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                      )}
                      <Typography variant="caption" color={passed ? "success.main" : "text.disabled"}>
                        {rule.label}
                      </Typography>
                    </Stack>
                  );
                })}
              </Box>
            </Stack>
          )}

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            size="small"
            aria-label="Confirm new password"
            error={confirmPassword.length > 0 && !passwordsMatch}
            helperText={confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    tabIndex={-1}
                  >
                    {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Error */}
          {error && (
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={saving}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!canSubmit}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5, px: 3 }}
        >
          {saving ? "Updating..." : "Update Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
