import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import payfastRoutes from "./routes/payfast.js";
import emailPreviewRoutes from "./routes/emailPreview.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// Middleware
// =========================

app.use(cors());

// Serve static files (branding, PDFs, etc.)
app.use(express.static("public"));

app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "FarmHand PRO Backend",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

// =========================
// API Routes
// =========================

app.use("/api/payfast", payfastRoutes);

// Email Preview
app.use("/email-preview", emailPreviewRoutes);

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// =========================
// Server
// =========================

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log(" FarmHand PRO Backend Started");
  console.log("======================================");
  console.log(` Server         : http://localhost:${PORT}`);
  console.log(` PayFast        : http://localhost:${PORT}/api/payfast`);
  console.log(` Email Preview  : http://localhost:${PORT}/email-preview/payment-receipt`);
  console.log(` Welcome Email  : http://localhost:${PORT}/email-preview/welcome`);
  console.log(` Branding       : http://localhost:${PORT}/branding/farmhand-logo.png`);
  console.log("======================================");
});
