const db = require("../config/db");

const listSubjects = async () => {
  const [rows] = await db.execute(
    `SELECT id, subject_code, subject_name
     FROM subjects
     ORDER BY subject_code ASC`
  );
  return rows;
};

module.exports = { listSubjects };
