import asyncHandler from "../middleware/asyncHandler.js";
import { createAssignment, getAssignments,getAssignmentById, getMyAssignments, updateAssignmentStatus, deleteAssignmentById } from "../services/assignment.service.js";

export const createAssignmentController = asyncHandler(async (req, res) => {

  const assignment = await createAssignment(
    req.params.taskId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Volunteer assigned successfully.",
    data: assignment,
  });

});

export const getAssignmentsController = asyncHandler(async (req, res) => {

  const assignments = await getAssignments(req.params.taskId);

  res.status(200).json({
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  });

});

export const getAssignmentByIdController = asyncHandler(async (req, res) => {

  const assignment = await getAssignmentById(
    req.params.assignmentId
  );

  res.status(200).json({
    success: true,
    message: "Assignment retrieved successfully.",
    data: assignment,
  });

});


export const updateAssignmentController = asyncHandler(async (req, res) => {

  const assignment = await updateAssignmentStatus(
    req.params.assignmentId,
    req.body,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Assignment updated successfully.",
    data: assignment,
  });

});

export const deleteAssignmentController = asyncHandler(async (req, res) => {

  const assignment = await deleteAssignmentById(
    req.params.assignmentId
  );

  res.status(200).json({
    success: true,
    message: `${assignment.User.firstName} ${assignment.User.lastName} has been unassigned from "${assignment.Task.title}".`,
    data: assignment,
  });

});

export const getMyAssignmentsController = asyncHandler(
  async (req, res) => {

    const assignments = await getMyAssignments(req.user);

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully.",
      data: assignments,
    });

  }
);