const express = require("express");
const organizationRouter = express.Router();
const { createOrganization } = require("../controllers/organizationController");
organizationRouter.route("/").post(createOrganization);
module.exports = organizationRouter;
