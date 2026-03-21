const { listSubjects } = require("../models/subjectModel");

const getSubjects = async (_req, res, next) => {
  try {
    const subjects = await listSubjects();
    return res.json({ count: subjects.length, subjects });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSubjects };
