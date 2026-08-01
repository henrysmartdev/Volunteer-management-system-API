import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import reportRoutes from "./routes/report.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Volunteer Management API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks/:taskId/assignments", assignmentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const message = error.message || "Internal server error";
  const normalizedMessage = message.toLowerCase();
  const status =
    error.status ||
    (normalizedMessage.includes("not found")
      ? 404
      : normalizedMessage.includes("not authorized") ||
          normalizedMessage.includes("unauthorized") ||
          normalizedMessage.includes("not assigned") ||
          normalizedMessage.includes("access denied")
        ? 403
        : normalizedMessage.includes("already") ||
            normalizedMessage.includes("exists")
          ? 409
          : normalizedMessage.includes("invalid") ||
              normalizedMessage.includes("expired") ||
              normalizedMessage.includes("cannot") ||
              normalizedMessage.includes("must")
            ? 400
            : 500);

  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    success: false,
    message,
  });
});

export default app;
