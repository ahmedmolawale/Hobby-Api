"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const hobbyservice_1 = require("./services/hobbyservice");
class Api {
    static createHobbyService(userModel, hobbyModel, router) {
        router.post('/api/hobby', (req, res) => {
            //handle the http post request
            let userData = req.body;
            if (userData === null || Object.keys(userData).length === 0) {
                console.log('POST: Incoming request has no body');
                res.status(404).json({ status: "fail", data: null, message: 'No data sent.' });
                return;
            }
            else if (userData.email == (null || undefined) || userData.username == (null || undefined)
                || userData.password == (null || undefined)) {
                console.log('Data of incoming request not complete');
                res.json({ status: "fail", data: null, message: 'Cant save data. Data of Incoming request not complete' });
            }
            else {
                console.log('Calling the POST handler service');
                hobbyservice_1.Service.addHobbyUser(userModel, req, res);
            }
        });
        router.get('/api/hobby', (req, res) => {
            let queryString = url.parse(req.url, true).query; //get the query string appended to the url
            if (Object.keys(queryString).length === 0) {
                console.log('GET: Incoming request has no params');
                res.status(401).json({ status: "fail", data: null, message: 'Cant retrieve Data. No params provided' });
                return;
            }
            else if (queryString.password == null || queryString.password == undefined
                || queryString.username == null || queryString.username == undefined) {
                console.log('GET: Incoming request params not completed');
                res.json({ status: "fail", data: null, message: 'Cant retrieve Data. Complete Params not specified!' });
            }
            else {
                console.log('Calling the GET handler service');
                hobbyservice_1.Service.getHobbyUser(userModel, queryString, res);
            }
        });
        router.get('/api/hobby/:username', (req, res) => {
            const PARAMS_USERNAME = 'username';
            let username = req.params[PARAMS_USERNAME];
            //let queryString = url.parse(req.url, true).query; //get the query string appended to the url
            if (username == (null || undefined)) {
                console.log('GET: Incoming request params not completed');
                res.json({ status: "fail", data: null, message: 'Cant retrieve Data. Complete Params not specified!' });
            }
            else {
                console.log('Calling the GET handler service');
                hobbyservice_1.Service.getHobbiesOfUser(userModel, username, res);
            }
        });
        router.put('/api/hobby/:username', (req, res) => {
            //handle the http update request
            const PARAMS_USERNAME = 'username';
            let username = req.params[PARAMS_USERNAME];
            let userData = req.body;
            if (userData === null || Object.keys(userData).length === 0) {
                console.log('POST: Incoming request has no body');
                res.json({ status: "fail", data: null, message: 'No data sent.' });
                return;
            }
            else if (username == (null || undefined)
                || userData.hobby == (null || undefined)) {
                console.log('Data of incoming request not complete');
                res.json({ status: "fail", data: null, message: 'Cant update data. Data of Incoming request not complete' });
            }
            else {
                console.log('Calling the PUT handler service');
                hobbyservice_1.Service.updateHobbyOfUser(userModel, hobbyModel, username, req, res);
            }
        });
        router.delete('/api/hobby/:username/:hobbyId', (req, res) => {
            const PARAMS_USERNAME = 'username';
            const PARAMS_HOBBY_ID = 'hobbyId';
            let username = req.params[PARAMS_USERNAME];
            let hobbyId = req.params[PARAMS_HOBBY_ID];
            if (username == (null || undefined) || hobbyId == (null || undefined)) {
                console.log('Username or hobby id not specified');
                res.json({ status: "fail", data: null, message: 'Params not specified' });
            }
            else {
                console.log('Calling Delete handler service');
                hobbyservice_1.Service.deleteHobbyOfUser(userModel, username, hobbyId, res);
            }
        });
    }
}
exports.Api = Api;
