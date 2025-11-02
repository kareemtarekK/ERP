const express = require("express");
const {
  createRole,
  getAllRoles,
  getRole,
  updateRole,
  deleteRole,
} = require("./../controllers/roleController");

const router = express();

router.route("/").post(createRole).get(getAllRoles);

router.route("/:roleId").patch(updateRole).get(getRole).delete(deleteRole);

module.exports = router;
