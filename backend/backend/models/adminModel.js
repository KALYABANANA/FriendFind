const db = require("../config/db");

const getDashboardStats = async () => {
  const [[usersCount]] = await db.execute("SELECT COUNT(*) as count FROM users");
  const [[groupsCount]] = await db.execute("SELECT COUNT(*) as count FROM study_groups");
  const [[subjectsCount]] = await db.execute("SELECT COUNT(*) as count FROM subjects");
  return {
    totalUsers: usersCount.count,
    totalGroups: groupsCount.count,
    totalSubjects: subjectsCount.count
  };
};

const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT id, username, email, phone, faculty, `year`, profile_image_url, created_at FROM users ORDER BY created_at DESC");
  return rows;
};

const deleteUser = async (id) => {
  const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

const getAllSubjects = async () => {
  const [rows] = await db.execute(`
    SELECT s.id, s.subject_code, s.subject_name, COUNT(us.user_id) as enrolled_count
    FROM subjects s
    LEFT JOIN user_subjects us ON s.id = us.subject_id
    GROUP BY s.id
    ORDER BY s.subject_code ASC
  `);
  return rows;
};

const createSubject = async (subjectCode, subjectName) => {
  const [result] = await db.execute("INSERT INTO subjects (subject_code, subject_name) VALUES (?, ?)", [subjectCode, subjectName]);
  return result.insertId;
};

const deleteSubject = async (id) => {
  const [result] = await db.execute("DELETE FROM subjects WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

const getAllGroups = async () => {
  const [rows] = await db.execute(`
    SELECT g.id, g.title, g.description, g.member_limit, g.created_at, 
           u.username as creator_name, s.subject_code, s.subject_name,
           (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as current_members
    FROM study_groups g
    JOIN users u ON g.creator_id = u.id
    JOIN subjects s ON g.subject_id = s.id
    ORDER BY g.created_at DESC
  `);
  return rows;
};

const deleteGroup = async (id) => {
  const [result] = await db.execute("DELETE FROM study_groups WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllSubjects,
  createSubject,
  deleteSubject,
  getAllGroups,
  deleteGroup
};
