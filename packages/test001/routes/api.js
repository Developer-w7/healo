var express = require("express");
var app = express();
var translationRouter = require("./query");

app.use((req, res, next) => {
    console.log('Middleware 2');
    next();
  });

app.use("/query", translationRouter);

module.exports = app;