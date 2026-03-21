const { fetchUsersByActiveSubject } = require("../models/userModel");

const getUsersByActiveSubject = async (req, res, next) => {
  try {
    const { subjectCode } = req.params;
    if (!subjectCode) {
      return res.status(400).json({ message: "subjectCode is required." });
    }

    const users = await fetchUsersByActiveSubject(subjectCode);
    return res.json({ count: users.length, users });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getUsersByActiveSubject };
