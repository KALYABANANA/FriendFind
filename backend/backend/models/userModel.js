const db = require("../config/db");

const createUser = async (userData) => {
  const { username, email, passwordHash, faculty, year, interests, profileImageUrl } = userData;

  const [result] = await db.execute(
    `INSERT INTO users
      (username, email, password_hash, faculty, \`year\`, interests, profile_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [username, email, passwordHash, faculty || null, year || null, interests || null, profileImageUrl || null]
  );

  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

const findUserByUsernameOrEmail = async (username, email) => {
  const [rows] = await db.execute(
    "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
    [username, email]
  );
  return rows[0] || null;
};

const fetchUsersByActiveSubject = async (subjectCode) => {
  const [rows] = await db.execute(
    `SELECT
       u.id,
       u.username,
       u.email,
       u.faculty,
       u.\`year\`,
       u.interests,
       u.profile_image_url,
       s.subject_code,
       s.subject_name,
       us.section
     FROM user_subjects us
     JOIN users u ON u.id = us.user_id
     JOIN subjects s ON s.id = us.subject_id
     WHERE us.is_active = TRUE
       AND s.subject_code = ?
     ORDER BY u.username ASC`,
    [subjectCode]
  );
  return rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsernameOrEmail,
  fetchUsersByActiveSubject,
};
