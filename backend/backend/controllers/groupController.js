const {
  createGroup,
  getGroups,
  requestJoinGroup,
  updateMemberStatus,
  getGroupMembers,
} = require("../models/groupModel");

const createStudyGroup = async (req, res, next) => {
  try {
    const { subject_id, title, description, member_limit } = req.body;
    if (!subject_id || !title) {
      return res.status(400).json({ message: "subject_id and title are required." });
    }

    const groupId = await createGroup({
      creatorId: req.user.id,
      subjectId: subject_id,
      title,
      description,
      memberLimit: member_limit,
    });

    return res.status(201).json({ message: "Study group created.", group_id: groupId });
  } catch (error) {
    return next(error);
  }
};

const listStudyGroups = async (req, res, next) => {
  try {
    const groups = await getGroups(req.query.subject_id);
    return res.json({ count: groups.length, groups });
  } catch (error) {
    return next(error);
  }
};

const joinStudyGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const created = await requestJoinGroup(groupId, req.user.id);

    if (!created) {
      return res.status(409).json({ message: "Join request already exists." });
    }

    return res.status(201).json({ message: "Join request submitted." });
  } catch (error) {
    return next(error);
  }
};

const updateGroupMemberStatus = async (req, res, next) => {
  try {
    const { groupId, userId } = req.params;
    const { join_status } = req.body;

    if (!["pending", "approved", "rejected", "left"].includes(join_status)) {
      return res.status(400).json({ message: "Invalid join_status value." });
    }

    const updated = await updateMemberStatus(groupId, userId, join_status);
    if (!updated) {
      return res.status(404).json({ message: "Group member not found." });
    }

    return res.json({ message: "Member status updated." });
  } catch (error) {
    return next(error);
  }
};

const listGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const members = await getGroupMembers(groupId);
    return res.json({ count: members.length, members });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createStudyGroup,
  listStudyGroups,
  joinStudyGroup,
  updateGroupMemberStatus,
  listGroupMembers,
};
