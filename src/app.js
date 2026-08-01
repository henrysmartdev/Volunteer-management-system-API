import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import tasksRoutes from "./routes/task.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import projectTasksRoutes from "./routes/task.routes.js";
import { sequelize } from "./models/index.js";


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
app.use("/api/v1/projects", projectTasksRoutes);
app.use("/api/v1/task", tasksRoutes);
app.use("/api/v1/tasks", assignmentRoutes);
app.use("/api/v1/assignments", assignmentRoutes);


export default app;
