import {
  assignVolunteers,
  getTaskAssignments,
  removeVolunteerAssignment,
} from "../services/assignment.service.js";

export const assignVolunteersController = async (req, res, next) => {
  try {
    const assignments = await assignVolunteers(
      req.params.taskId,
      req.user.id,
      req.body.volunteerIds,
    );

    res.status(201).json({
      success: true,
      message: "Volunteers assigned successfully",
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskAssignmentsController = async (req, res, next) => {
  try {
    const assignments = await getTaskAssignments(req.params.taskId);

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const removeVolunteerAssignmentController = async (req, res, next) => {
  try {
    await removeVolunteerAssignment(
      req.params.taskId,
      req.params.volunteerId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Volunteer removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
