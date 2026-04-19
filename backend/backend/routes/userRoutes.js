const express = require("express");
const { getUsersByActiveSubject, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/active-subject/:subjectCode", getUsersByActiveSubject);
router.get("/", getAllUsers);

module.exports = router;
