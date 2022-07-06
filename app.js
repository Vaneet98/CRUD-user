require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3020;
var cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


require("./config/connectionDB").connect();
require("./config/connectionDB").syn();
require("./model");
const router = require("./routes/index");
app.get("/api", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
