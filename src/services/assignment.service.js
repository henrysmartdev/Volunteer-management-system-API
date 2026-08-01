import Task from "../models/Task.js";
import Assignment from "../models/Assignment.js";
import { validate as isUuid } from "uuid";
import { ROLES } from "../constants/roles.js";
import User from "../models/User.js";

export const createAssignment = async (taskId, body) => {

    if (!isUuid(taskId)) {
  throw new Error("Invalid task ID.");
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
    throw new Error("Task not found.");
    }

    const { volunteerId } = body;

    if (!isUuid(volunteerId)) {
    throw new Error("Invalid volunteer ID.");
    }

    const volunteer = await User.findByPk(volunteerId);

    if (!volunteer) {
    throw new Error("Volunteer not found.");
    }

    if (volunteer.role !== ROLES.VOLUNTEER) {
  throw new Error(
    "Only users with the Volunteer role can be assigned to tasks."
  );
    }

        //Avoid voluteers being assigned to the same task more than once
    const existingAssignment = await Assignment.findOne({
  where: {
    taskId,
    volunteerId,
  },
    });

    if (existingAssignment) {
    throw new Error(
        "Volunteer is already assigned to this task."
    );
    }

    const assignment = await Assignment.create({
        taskId,
        volunteerId,
    });

    return assignment;
};

export const getAssignments = async (taskId) => {
    if (!isUuid(taskId)) {
  throw new Error("Invalid task ID.");
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
    throw new Error("Task not found.");
    }

    const assignments = await Assignment.findAll({
        where: {
            taskId,
        },
        include: [
            {
            model: User,
            attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
            ],
            },
        ],
        });

         return assignments;

};

export const getAssignmentById = async (assignmentId) => {

    if (!isUuid(assignmentId)) {
  throw new Error("Invalid assignment ID.");
    }

    const assignment = await Assignment.findByPk(assignmentId, {
        include: [
            {
            model: User,
            attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
            ],
            },
            {
            model: Task,
            attributes: [
                "id",
                "title",
                "priority",
                "dueDate",
            ],
            },
        ],
        });

        if (!assignment) {
  throw new Error("Assignment not found.");
    }

    return assignment;
};

const updateTaskStatus = async (taskId) => {

  // Check that the task exists
  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  // Get all assignments for the task
  const assignments = await Assignment.findAll({
    where: {
      taskId,
    },
  });

  // Default status
  let newStatus = "NOT_STARTED";

  // If there are assignments
  if (assignments.length > 0) {

    const statuses = assignments.map(
      assignment => assignment.status
    );

    // Everyone has completed
    if (
      statuses.every(
        status => status === "COMPLETED"
      )
    ) {

      newStatus = "COMPLETED";

    }

    // At least one volunteer has started or completed
    else if (
      statuses.some(
        status =>
          status === "IN_PROGRESS" ||
          status === "COMPLETED"
      )
    ) {

      newStatus = "IN_PROGRESS";

    }

  }

  // Update task status
  await task.update({
    status: newStatus,
  });

};

export const updateAssignmentStatus = async (
  assignmentId,
  body,
  user
) => {

  if (!isUuid(assignmentId)) {
    throw new Error("Invalid assignment ID.");
  }

  const assignment = await Assignment.findByPk(
    assignmentId
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const isCoordinator =
    user.role === ROLES.COORDINATOR;

  const isOwner =
    assignment.volunteerId === user.id;

  if  (!(isCoordinator || isOwner)) {
    throw new Error(
      "You are not authorized to update this assignment."
    );
  }

  const allowedFields = ["status"];

  const receivedFields = Object.keys(body);

  const hasValidUpdate = receivedFields.some(field =>
    allowedFields.includes(field)
  );

  if (!hasValidUpdate) {
    throw new Error(
      "Please provide a valid field to update."
    );
  }

  await assignment.update({
    status: body.status,
  });

   // Synchronize the parent task's status
  await updateTaskStatus(
    assignment.taskId
  );


  return assignment;
};


export const deleteAssignmentById = async (assignmentId) => {

  if (!isUuid(assignmentId)) {
    throw new Error("Invalid assignment ID.");
  }

  const assignment = await Assignment.findByPk(assignmentId, {
    include: [
      {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
        ],
      },
      {
        model: Task,
        attributes: [
          "id",
          "title",
        ],
      },
    ],
  });

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  await assignment.destroy();

  return assignment;
};

export const getMyAssignments = async (user) => {

  return await Assignment.findAll({
    where: {
      volunteerId: user.id,
    },
    include: [
      {
        model: Task,
        attributes: [
          "id",
          "title",
          "description",
          "priority",
          "status",
          "dueDate",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  
};