import { User, Project, Attendance } from '../models';
import asyncHandler from '../middleware/asyncHandler';

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  
  const [totalVolunteers, totalProjects, presentCount, absentCount] = await Promise.all([
    User.count({ where: { role: 'volunteer' } }), 
    Project.count(),
    Attendance.count({ where: { status: 'present' } }), 
    Attendance.count({ where: { status: 'absent' } }),
  ]);

  const totalAttendanceRecords = presentCount + absentCount;

  res.status(200).json({
    success: true,
    data: {
      totalVolunteers,
      totalProjects,
      attendanceSummary: {
        totalRecords: totalAttendanceRecords,
        present: presentCount,
        absent: absentCount,
        attendanceRate:
          totalAttendanceRecords === 0
            ? null
            : Number(((presentCount / totalAttendanceRecords) * 100).toFixed(1)),
      },
    },
  });
});

export default { getDashboardAnalytics };