const express = require("express");
const jornalRouter = express.Router();
const {
  getAllJornals,
  createJornal,
  deleteJornal,
  getAllJornalEntries,
} = require("./../controllers/jornalController");
jornalRouter.route("/").get(getAllJornals).post(createJornal);
jornalRouter.delete("/:jornalId", deleteJornal);
jornalRouter.get("/:jornalId/jornalEntries", getAllJornalEntries);

module.exports = jornalRouter;
