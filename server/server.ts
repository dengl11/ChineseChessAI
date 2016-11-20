/// <reference path="../typings/index.d.ts" />
import * as express from 'express';
import { join } from 'path';
import { json, urlencoded } from "body-parser";

const app: express.Application = express();

app.use(express.static(join(__dirname, '../public')));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/client', express.static(join(__dirname, '../client')));

if (app.get("env") === "development") {
    app.use(express.static(join(__dirname, '../node_modules')));
    // app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
    //     res.status(err.status || 500);
    //     res.json({
    //         error: err,
    //         message: err.message
    //     });
    // });
}
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }
