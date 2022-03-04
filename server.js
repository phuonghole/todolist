const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.listen(port, () =>
console.log("> Server is up and running on port : " + port)
);
const cookies = require("cookie-parser");
app.use(cookies());
const cors = require("cors");
app.use(cors());
app.use(express.json());
const colors = require("colors");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("> Connected...".bgCyan))
  .catch((err) =>
    console.log(
      `> Error while connecting to mongoDB : ${err.message}`.underline.red
    )
  );
const userRouter = require("./routers/userRouter");
app.use("/users", userRouter);
const noteRouter = require("./routers/noteRouter");
app.use("/notes", noteRouter);
