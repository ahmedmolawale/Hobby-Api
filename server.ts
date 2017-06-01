import { hobbySchema } from './api/schemas/hobbySchema';
import { IHobbyModel } from './api/models/hobby';
import { Model } from 'mongoose';
import { userSchema } from './api/schemas/userSchema';
import * as mongoose from 'mongoose';
import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from "express";

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import * as methodOverride from 'method-override';

import * as bluebirdPromise from 'bluebird';
import { IUserModel } from "./api/models/user";
import { Api } from "./api/api";

export class Server {

    public app: Application;
    private userModel: Model<IUserModel>;
    private hobbyModel: Model<IHobbyModel>;

    //this is used to start the application
    public static bootstrap(): Server {
        return new Server();
    }
    constructor() {

        this.userModel = Object();
        this.app = express();
        this.config();
        this.api();
    }

    public config(): void {
        const MONGODB_CONNECTION: string = "mongodb://stackode:Agptwmdc@ds161041.mlab.com:61041/hobbyapp";

// const MONGODB_CONNECTION: string = "mongodb://127.0.0.1:27017/hobbyapp";

        //use logger middlware
        this.app.use(logger("dev"));
        //use json form parser middlware
        this.app.use(bodyParser.json());
        //use query string parser middlware
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        //use cookie parker middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        //use override middlware
        this.app.use(methodOverride());
        global.Promise = bluebirdPromise;



        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

        this.userModel = connection.model<IUserModel>('user', userSchema);
        this.hobbyModel = connection.model<IHobbyModel>('hobby', hobbySchema);
        this.app.use((error: any, request: Request, response: Response, next: NextFunction) => {
            error.status(404);
            next(error);
        });
        //error handling
        this.app.use(errorHandler());
    }
    private api(): void {
        let router: Router = Router();
        Api.createHobbyService(this.userModel, this.hobbyModel, router);
        this.app.use(router);

    }
}
