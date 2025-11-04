const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const app = require("./app");
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE_STRING.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connection successful✅");
  })
  .catch((err) => {
    console.log("Error 🔥", err);
  });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
