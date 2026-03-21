const express = require("express");
const { getUsersByActiveSubject } = require("../controllers/userController");

const router = express.Router();

router.get("/active-subject/:subjectCode", getUsersByActiveSubject);

module.exports = router;
