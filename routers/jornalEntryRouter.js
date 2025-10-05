const express = require("express");
const jornalEntryRouter = express.Router();
const {
  createJornalEntry,
  getAllJornalEntries,
  getJornalEntry,
  updateJornalEntry,
  deleteJornalEntry,
} = require("./../controllers/jornalEntryController");
jornalEntryRouter.route("/").get(getAllJornalEntries).post(createJornalEntry);
jornalEntryRouter
  .route("/:jornalEntryId")
  .get(getJornalEntry)
  .patch(updateJornalEntry)
  .delete(deleteJornalEntry);
module.exports = jornalEntryRouter;
