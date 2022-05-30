require("dotenv").config();
const API_PORT = process.env.API_PORT || 3000;

// express setting
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// command
const { execSync } = require("child_process");

app.get("/healthcheck", (req, res) => {
  res.statusCode = 200;
  res.end("healthy");
});

app.post("/robotstxt", (req, res) => {
  console.log(req.body);
  const stdout = execSync(
    `node download.js "${req.body.url}" "${req.body.host}"`
  );
  console.log(`stdout: ${stdout.toString()}`);
  res.statusCode = 200;
  res.end("finish");
});

app.listen(API_PORT, () => {
  console.log(`start server on port ${API_PORT}`);
});
