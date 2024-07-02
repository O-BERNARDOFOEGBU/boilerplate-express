const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
};

app.use(logger);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("Hello World");

// Middleware to add current time
const addCurrentTime = (req, res, next) => {
  req.time = new Date().toString();
  next();
};

app.get("/now", addCurrentTime, (req, res) => {
  res.send({ time: req.time });
});

app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({ echo: word });
});

app
  .route("/name")
  .get((req, res) => {
    const { first: firstname, last: lastname } = req.query;

    if (!firstname || !lastname) {
      return res
        .status(400)
        .json({ error: "Both first and last name are required" });
    }

    res.json({ name: `${firstname} ${lastname}` });
  })
  .post((req, res) => {
    const { first, last } = req.body;

    if (!first || !last) {
      return res
        .status(400)
        .json({ error: "Both first and last name are required" });
    }

    res.json({ name: `${first} ${last}` });
  });

// app.get("/json", function (req, res) {
//   let message = "Hello json";
//   if (process.env.MESSAGE_STYLE === "uppercase") {
//     message = message.toUpperCase();
//   }
//   res.json({ message: message });
// });

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/public", express.static(__dirname + "/public/style.css"));

// 404 handler
app.use((req, res) => {
  res.status(404).send({ error: "Not Found" });
});

module.exports = app;
