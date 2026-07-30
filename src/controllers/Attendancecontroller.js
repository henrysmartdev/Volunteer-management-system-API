const { Attendance } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

const logAttendance = asyncHandler(async (req, res) => {
  const { volunteerId, projectId, taskId, date, hoursLogged, status } = req.body;

  if (!volunteerId || !projectId || !date || hoursLogged === undefined) {
    return res.status(400).json({
      success: false,
      message: 'volunteerId, projectId, date, and hoursLogged are required',
    });
  }

  const record = await Attendance.create({
    volunteerId,
    projectId,
    taskId,
    date,
    hoursLogged,
    status,
  });

  res.status(201).json({ success: true, data: record });
});

export default { logAttendance };