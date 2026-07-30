import { Op, fn, col } from 'sequelize';
import { Attendance, User, Project } from '../models';
import asyncHandler from '../middleware/asyncHandler';


const getVolunteerHoursReport = asyncHandler(async (req, res) => {
  const { volunteerId, startDate, endDate } = req.query;

  
  const where = {};
  if (volunteerId) where.volunteerId = volunteerId;

  if (startDate || endDate) {
    where.date = {};
    
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  const stats = await Attendance.findAll({
    where,
    attributes: [
      'volunteerId',
      [fn('SUM', col('hoursLogged')), 'totalHours'], 
      [fn('COUNT', col('id')), 'sessionsAttended'], 
    ],
    group: ['volunteerId'], 
    order: [[fn('SUM', col('hoursLogged')), 'DESC']], 
    raw: true, 
    
  });

  
  const volunteerIds = stats.map((s) => s.volunteerId);

  const volunteers = await User.findAll({
    where: { id: volunteerIds }, 
    attributes: ['id', 'name', 'email'],
    raw: true,
  });

  
  const volunteerMap = {};
  volunteers.forEach((v) => {
    volunteerMap[v.id] = v;
  });


  const report = stats.map((s) => ({
    volunteerId: s.volunteerId,
    name: volunteerMap[s.volunteerId]?.name,
    email: volunteerMap[s.volunteerId]?.email,
    totalHours: Number(s.totalHours), 
    sessionsAttended: Number(s.sessionsAttended),
  }));

  res.status(200).json({ success: true, count: report.length, data: report });
});


const getAttendanceReport = asyncHandler(async (req, res) => {
  const { projectId, volunteerId, status, startDate, endDate } = req.query;

  const where = {};
  if (projectId) where.projectId = projectId;
  if (volunteerId) where.volunteerId = volunteerId;
  if (status) where.status = status; // "present" or "absent"

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  const records = await Attendance.findAll({
    where,
    include: [
      { model: User, as: 'volunteer', attributes: ['id', 'name', 'email'] },
      { model: Project, attributes: ['id', 'title'] },
    ],
    order: [['date', 'DESC']], // most recent first
  });

  res.status(200).json({ success: true, count: records.length, data: records });
});

export default { getVolunteerHoursReport, getAttendanceReport };