import { IHobbyModel } from '../models/hobby';
import { IUserModel } from '../models/user';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
export class Service {

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
    public static addHobbyUser(userModel: Model<IUserModel>, req: Request, res: Response): any {

        //create a new document using the model recieved
        let userData: any = req.body;
        let user = new userModel();  //this is instantiating a document from the model

        user.email = userData.email;
        user.username = userData.username;
        user.dateCreated = new Date().toDateString();
        //no hobby yet really

        //hash the password
        bcrypt.hash(userData.password, 10, (err: any, hash: any) => {
            // Store hash in database
            user.password = hash;
            user.save().then((result: any) => {
                console.log('User saved successfully.');
                res.status(201).json({ success: 1, message: 'User saved on server successfully' });

            }).catch((error: any) => {
                console.log('An error occurred due to ' + error);
                res.status(409).json({ success: 0, message: 'User already exist' })
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
    public static getHobbyUser(userModel: Model<IUserModel>, queryString: string, res: Response): void {
        console.log(queryString);

        let username: string = queryString['username'].trim();
        let password: string = queryString['password'].trim();
        const query = userModel.findOne({ username: username }, '-_id -__v');

        query.exec().then((result: IUserModel) => {
            if (!result) {
                console.log('We hava an empty result');
                res.status(404).json({ success: 0, message: 'No data found.' });

            } else {
                console.log('We got result');
                let hashPassword: any = result.password;
                bcrypt.compare(password, hashPassword, (err1: any, res1: Response) => {
                    if (res1) {
                        // Passwords match
                      result.password = null;
                        res.status(200).json(result);

                    } else {
                        // Passwords don't match
                    res.status(200).json({ success: 0, message: 'Login Parameter not correct.' });
                    }
                });

            }
        }).catch((error: any) => {
            console.error(error);
             res.status(404).json({ success: 0, message: 'No data found. Ensure Params is appropriately formed.' });
        
        });
    }
   
    public static updateHobbyOfUser(userModel: Model<IUserModel>, hobbyModel:Model<IHobbyModel>,username:string,req: Request, res: Response): void {

        let hobby = new hobbyModel();
        hobby.hobby = req.body.hobby;
        hobby.dateCreated = new Date().toDateString();
        userModel.findOne({ username: username }, (error: any, result: IUserModel) => {
            if (result) {

                result.hobbies.push(hobby);
                result.save((error: any, result1) => {
                    if (result1) {
                        console.log("Hobby saved sucessfully");
                        res.status(200).json({ success: 1, message: 'Hobby saved successfully' });
                    } else {
                        console.log("Hobby not saved sucessfully");
                         res.status(402).json({ success: 1, message: 'Hobby not saved' });
                    }
                });
            } else {
                console.log('User ', username, ' not found');
                res.status(404).json({ success: 0, message: 'User not found' });
            }
        });
    }

    public static deleteHobbyOfUser(userModel:Model<IUserModel>,username:string,hobbyId:string,res:Response){

            userModel.update({username:username},
                            { $pull: { hobbies: { _id: hobbyId } } },
                { multi: true },(error:any,raw:any)=>{
                    if(raw){
                        console.log('Hobby deleted successfully.');
                        res.status(200).json({success:1,message:'Hobby deleted successfully'});
                }
                });

    }
}