
import { IHobbyModel } from "./hobby";
import { Document, Model } from 'mongoose';
export interface IUserModel extends Document {
    dateCreated:string,
    email: string,
    username: string,
    password: string,
    hobbies: IHobbyModel[],
} 