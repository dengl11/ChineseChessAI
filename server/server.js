"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../typings/index.d.ts" />
var express = require("express");
var path_1 = require("path");
var body_parser_1 = require("body-parser");
var app = express();
exports.app = app;
app.use(express.static(path_1.join(__dirname, '../public')));
app.use(body_parser_1.json());
app.use(body_parser_1.urlencoded({ extended: true }));
app.use('/client', express.static(path_1.join(__dirname, '../client')));
if (app.get("env") === "development") {
    app.use(express.static(path_1.join(__dirname, '../node_modules')));
    // app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
    //     res.status(err.status || 500);
    //     res.json({
    //         error: err,
    //         message: err.message
    //     });
    // });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});
//# sourceMappingURL=server.js.map