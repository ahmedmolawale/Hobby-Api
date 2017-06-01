"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
class Service {
    /**
    * @class Service
    *
    * A service to create user
    *
    * @param userModel: Model<IUserModel>
    * @param req: Request
    * @param res: Response
    * @return any
    */
    static addHobbyUser(userModel, req, res) {
        //create a new document using the model recieved
        let userData = req.body;
        let user = new userModel(); //this is instantiating a document from the model
        user.email = userData.email;
        user.username = userData.username;
        user.dateCreated = new Date().toDateString();
        //no hobby yet really
        //hash the password
        bcrypt.hash(userData.password, 10, (err, hash) => {
            // Store hash in database
            user.password = hash;
            user.save().then((result) => {
                if (!result) {
                    console.log('User already in database.');
                    res.json({
                        status: "fail",
                        data: null,
                        message: 'User already exist'
                    });
                }
                else {
                    console.log('User saved successfully.');
                    res.status(201).json({
                        status: "success",
                        data: null,
                        message: 'User saved on server successfully'
                    });
                }
            }).catch((error) => {
                console.log('An error occurred due to ' + error);
                res.json({
                    status: "fail",
                    data: null,
                    message: 'User already exist.'
                });
            });
        });
    }
    /**
    * @class Service
    *
    * A service to get hobby user
    *
    * @param user: Model<IUserModel>
    * @param queryString: String[]
    * @param response: Response
    * @return void
    */
    static getHobbyUser(userModel, queryString, res) {
        console.log(queryString);
        let username = queryString['username'].trim();
        let password = queryString['password'].trim();
        const query = userModel.findOne({ username: username }, '-_id -__v');
        query.exec().then((result) => {
            if (!result) {
                console.log('We hava an empty result');
                res.json({
                    success: "fail",
                    data: null,
                    message: 'User not found'
                });
            }
            else {
                console.log('We got result');
                let hashPassword = result.password;
                bcrypt.compare(password, hashPassword, (err1, res1) => {
                    if (res1) {
                        // Passwords match
                        result.password = null;
                        let re = { status: "success", data: result, message: "Login Successful" };
                        res.status(200).json(re);
                    }
                    else {
                        // Passwords don't match
                        res.json({ status: "fail", data: null, message: 'Login Parameter not correct.' });
                    }
                });
            }
        }).catch((error) => {
            console.error(error);
            res.json({ status: "fail", data: null, message: 'No data found. Ensure Params is appropriately formed.' });
        });
    }
    static getHobbiesOfUser(userModel, username, res) {
        userModel.findOne({ username: username }, '-_id -__v', (error, result) => {
            if (result) {
                console.log("Hobbies retrieved");
                result.password = null;
                res.status(200).json({ status: "success", data: result, message: 'Hobbies retrieved.' });
            }
            else {
                console.log("Hobbies not retrieved");
                res.json({ status: "fail", data: null, message: 'Hobbies not retrieved.' });
            }
        });
    }
    static updateHobbyOfUser(userModel, hobbyModel, username, req, res) {
        let hobby = new hobbyModel();
        hobby.hobby = req.body.hobby;
        hobby.dateCreated = new Date().toDateString();
        userModel.findOne({ username: username }, (error, result) => {
            if (result) {
                result.hobbies.push(hobby);
                result.save((error, result1) => {
                    if (result1) {
                        console.log("Hobby saved sucessfully");
                        res.status(200).json({ status: "success", data: null, message: 'Hobby saved successfully' });
                    }
                    else {
                        console.log("Hobby not saved sucessfully");
                        res.json({ status: "fail", data: null, message: 'Hobby not saved' });
                    }
                });
            }
            else {
                console.log('User ', username, ' not found');
                res.json({ status: "fail", data: null, message: 'User not found' });
            }
        });
    }
    static deleteHobbyOfUser(userModel, username, hobbyId, res) {
        userModel.update({ username: username }, { $pull: { hobbies: { _id: hobbyId } } }, { multi: true }, (error, raw) => {
            if (raw) {
                console.log('Hobby deleted successfully.');
                res.status(200).json({ status: "success", data: null, message: 'Hobby deleted successfully' });
            }
        });
    }
}
exports.Service = Service;
