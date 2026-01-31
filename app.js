require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");
const { errors } = require("celebrate");
const { requestlogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(requestlogger);
app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
