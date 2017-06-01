import { Schema } from "mongoose";
import {NextFunction} from "express";
export const hobbySchema: Schema = new Schema(
    {
    dateCreated:{type:String},
    hobby:{type:String}
});