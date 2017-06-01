"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hobbySchema_1 = require("./api/schemas/hobbySchema");
const userSchema_1 = require("./api/schemas/userSchema");
const mongoose = require("mongoose");
const express = require("express");
const express_1 = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const bluebirdPromise = require("bluebird");
const api_1 = require("./api/api");
class Server {
    //this is used to start the application
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.userModel = Object();
        this.app = express();
        this.config();
        this.api();
    }
    config() {
        const MONGODB_CONNECTION = "mongodb://stackodes:Agptwmdc@ds161041.mlab.com:61041/hobbyapp";
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
        let connection = mongoose.createConnection(MONGODB_CONNECTION);
        this.userModel = connection.model('user', userSchema_1.userSchema);
        this.hobbyModel = connection.model('hobby', hobbySchema_1.hobbySchema);
        this.app.use((error, request, response, next) => {
            error.status(404);
            next(error);
        });
        //error handling
        this.app.use(errorHandler());
    }
    api() {
        let router = express_1.Router();
        api_1.Api.createHobbyService(this.userModel, this.hobbyModel, router);
        this.app.use(router);
    }
}
exports.Server = Server;
