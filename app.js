const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
