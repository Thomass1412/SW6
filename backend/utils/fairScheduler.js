const Shift = require('../models/shift');
const User = require('../models/user');
const mongoose = require('mongoose');

// Utility to get shift duration in hours
const getDuration = (start, end) => {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
};

async function generateFairSchedule() {
  // Get all shifts that are not yet assigned
  const unassignedShifts = await Shift.find({ employee: null, status: 'scheduled' });

  // Get all users
  const users = await User.find({ role: 'User' });

  // Preload existing shifts (availability)
  const allShifts = await Shift.find({
    status: { $in: ['scheduled', 'unavailability'] }
  });

  // Create maps for shift count and total hours
  const userStats = users.reduce((acc, user) => {
    acc[user._id] = {
      user,
      totalHours: 0,
      assignedCount: 0,
      schedule: [],
    };
    return acc;
  }, {});

  // Aggregate current shifts per user
  for (const shift of allShifts) {
    if (!shift.employee) continue;
    const dur = getDuration(shift.startTime, shift.endTime);
    if (userStats[shift.employee]) {
      userStats[shift.employee].totalHours += dur;
      userStats[shift.employee].schedule.push(shift);
      userStats[shift.employee].assignedCount += 1;
    }
  }

  // Assign shifts
  const assignments = [];

  for (const shift of unassignedShifts) {
    const candidates = users.filter(u =>
      u.jobTitle.includes(shift.jobTitle)
    ).filter(u => {
      const stats = userStats[u._id];

      // Skip if over hoursPerWeek
      const shiftHours = getDuration(shift.startTime, shift.endTime);
      if (stats.totalHours + shiftHours > u.hoursPerWeek) return false;

      // Check for availability
      return !stats.schedule.some(s =>
        s.date.toISOString().split('T')[0] === shift.date.toISOString().split('T')[0] &&
        !(s.endTime <= shift.startTime || s.startTime >= shift.endTime)
      );
    });

    // Sort by fewest assigned shifts
    candidates.sort((a, b) => {
      return userStats[a._id].assignedCount - userStats[b._id].assignedCount;
    });

    const selected = candidates[0];
    if (selected) {
      shift.employee = selected._id;
      await shift.save();

      const shiftHours = getDuration(shift.startTime, shift.endTime);
      userStats[selected._id].totalHours += shiftHours;
      userStats[selected._id].assignedCount += 1;
      userStats[selected._id].schedule.push(shift);

      assignments.push({
        shiftId: shift._id,
        employeeId: selected._id,
        name: selected.name,
        jobTitle: shift.jobTitle,
        date: shift.date,
      });
    } else {
      assignments.push({
        shiftId: shift._id,
        employeeId: null,
        reason: "No available user found"
      });
    }
  }

  return assignments;
}

module.exports = { generateFairSchedule };
