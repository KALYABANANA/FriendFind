const db = require("../config/db");

const createGroup = async ({ creatorId, subjectId, title, description, memberLimit }) => {
  const [result] = await db.execute(
    `INSERT INTO study_groups (creator_id, subject_id, title, description, member_limit)
     VALUES (?, ?, ?, ?, ?)`,
    [creatorId, subjectId, title, description || null, memberLimit || null]
  );

  await db.execute(
    `INSERT INTO group_members (group_id, user_id, role, join_status)
     VALUES (?, ?, 'owner', 'approved')`,
    [result.insertId, creatorId]
  );

  return result.insertId;
};

const getGroups = async (subjectId) => {
  let query = `
    SELECT
      g.id,
      g.creator_id,
      g.subject_id,
      s.subject_code,
      s.subject_name,
      g.title,
      g.description,
      g.member_limit
    FROM study_groups g
    JOIN subjects s ON s.id = g.subject_id`;
  const params = [];

  if (subjectId) {
    query += " WHERE g.subject_id = ?";
    params.push(subjectId);
  }

  query += " ORDER BY g.id DESC";
  const [rows] = await db.execute(query, params);
  return rows;
};

const requestJoinGroup = async (groupId, userId) => {
  const [rows] = await db.execute(
    `SELECT group_id, user_id
     FROM group_members
     WHERE group_id = ? AND user_id = ? LIMIT 1`,
    [groupId, userId]
  );

  if (rows[0]) return false;

  await db.execute(
    `INSERT INTO group_members (group_id, user_id, role, join_status)
     VALUES (?, ?, 'member', 'pending')`,
    [groupId, userId]
  );
  return true;
};

const updateMemberStatus = async (groupId, userId, joinStatus) => {
  const [result] = await db.execute(
    `UPDATE group_members
     SET join_status = ?
     WHERE group_id = ? AND user_id = ?`,
    [joinStatus, groupId, userId]
  );
  return result.affectedRows > 0;
};

const getGroupMembers = async (groupId) => {
  const [rows] = await db.execute(
    `SELECT
       gm.group_id,
       gm.user_id,
       u.username,
       u.email,
       gm.role,
       gm.join_status
     FROM group_members gm
     JOIN users u ON u.id = gm.user_id
     WHERE gm.group_id = ?
     ORDER BY gm.role DESC, u.username ASC`,
    [groupId]
  );
  return rows;
};

module.exports = {
  createGroup,
  getGroups,
  requestJoinGroup,
  updateMemberStatus,
  getGroupMembers,
};
