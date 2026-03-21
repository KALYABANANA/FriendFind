const express = require("express");
const {
  createStudyGroup,
  listStudyGroups,
  joinStudyGroup,
  updateGroupMemberStatus,
  listGroupMembers,
} = require("../controllers/groupController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listStudyGroups);
router.get("/:groupId/members", listGroupMembers);
router.post("/", requireAuth, createStudyGroup);
router.post("/:groupId/join", requireAuth, joinStudyGroup);
router.patch("/:groupId/members/:userId", requireAuth, updateGroupMemberStatus);

module.exports = router;
