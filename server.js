const app = require("./app");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful✅");
  })
  .catch((err) => {
    console.log("Error 🔥", err);
  });

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on port ${port}`);
});
