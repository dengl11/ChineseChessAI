"use strict";
/// <reference path="../typings/index.d.ts" />
var express = require('express');
var path_1 = require('path');
// import * as favicon from 'serve-favicon';
var body_parser_1 = require("body-parser");
// import { loginRouter } from "./routes/login";
// import { protectedRouter } from "./routes/protected";
var app = express();
exports.app = app;
// app.disable("x-powered-by");
// app.use(favicon(join(__dirname, "../public", "favicon.ico")));
app.use(express.static(path_1.join(__dirname, '../public')));
app.use(body_parser_1.json());
app.use(body_parser_1.urlencoded({ extended: true }));
// api routes
// app.use("/api", prote``ctedRouter);
// app.use("/login", loginRouter);
app.use('/client', express.static(path_1.join(__dirname, '../client')));
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(express.static(path_1.join(__dirname, '../node_modules')));
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}
// catch 404 and forward to error handler
// app.use(function(req: express.Request, res: express.Response, next) {
//     let err = new Error("Not Found");
//     next(err);
// });
// //
// // production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});
//# sourceMappingURL=server.js.map