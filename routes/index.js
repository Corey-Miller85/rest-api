"use strict";

const express = require("express");
const users = require("./users");
const courses = require("./courses");

const app = express();

app.use("/users", users);
app.use("/courses", courses);

module.exports = app;
