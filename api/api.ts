import { IHobbyModel } from './models/hobby';
import { Model } from 'mongoose';
import { IUserModel } from './models/user';
import url = require('url');
import { Router, Request, Response } from "express";
import { Service } from "./services/hobbyservice";

export class Api {

    public static createHobbyService(userModel: Model<IUserModel>, hobbyModel: Model<IHobbyModel>, router: Router): void {

        router.post('/api/hobby', (req: Request, res: Response) => {
            //handle the http post request
            let userData = req.body;
            if (userData === null || Object.keys(userData).length === 0) {
                console.log('POST: Incoming request has no body');
                res.status(404).json({ success: 0, message: 'No data sent.' });
                return;
            } else if (userData.email == (null || undefined) || userData.username == (null || undefined)
                || userData.password == (null || undefined)) {
                console.log('Data of incoming request not complete');
                res.status(401).json({ success: 0, message: 'Cant save data. Data of Incoming request not complete' });
            } else {
                console.log('Calling the POST handler service');
                Service.addHobbyUser(userModel, req, res);
            }
        });

        router.get('/api/hobby', (req: Request, res: Response) => {

            let queryString = url.parse(req.url, true).query; //get the query string appended to the url
            if (Object.keys(queryString).length === 0) {
                console.log('GET: Incoming request has no params');
                res.status(401).json({ success: 0, message: 'Cant retrieve Data. No params provided' });
                return;
            } else if (queryString.password == null || queryString.password == undefined
                || queryString.username == null || queryString.username == undefined) {
                console.log('GET: Incoming request params not completed');
                res.status(401).json({ success: 0, message: 'Cant retrieve Data. Complete Params not specified!' });
            } else {
                console.log('Calling the GET handler service');
                Service.getHobbyUser(userModel, queryString, res);
            }
        });

        router.put('/api/hobby/:username', (req: Request, res: Response) => {
            //handle the http update request

            const PARAMS_USERNAME: string = 'username';
            let username: string = req.params[PARAMS_USERNAME];
            let userData = req.body;
            if (userData === null || Object.keys(userData).length === 0) {
                console.log('POST: Incoming request has no body');
                res.status(404).json({ success: 0, message: 'No data sent.' });
                return;
            } else if (username == (null || undefined)
                || userData.hobby == (null || undefined)) {
                console.log('Data of incoming request not complete');
                res.status(401).json({ success: 0, message: 'Cant update data. Data of Incoming request not complete' });
            } else {
                console.log('Calling the PUT handler service');
                Service.updateHobbyOfUser(userModel, hobbyModel, username, req, res);
            }



        });
        router.delete('/api/hobby/:username/:hobbyId', (req: Request, res: Response) => {
            const PARAMS_USERNAME: string = 'username';
            const PARAMS_HOBBY_ID: string = 'hobbyId';
            let username: string = req.params[PARAMS_USERNAME];
            let hobbyId: string = req.params[PARAMS_HOBBY_ID];
            if (username == (null || undefined) || hobbyId == (null || undefined)) {
                console.log('Username or hobby id not specified');
                res.status(401).json({ success: 0, message: 'Params not specified' });
            } else {
                console.log('Calling Delete handler service');
                Service.deleteHobbyOfUser(userModel, username, hobbyId, res);
            }

        });

    }


}