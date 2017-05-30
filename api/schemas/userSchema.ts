import { hobbySchema } from './hobbySchema';
import { Schema } from "mongoose";
import { NextFunction } from "express";

export const userSchema: Schema = new Schema({
    dateCreated:{type:String},
    email:{type:String,required:true},
    username:{type:String,required:true },
    password:{type:String,required:true},
    hobbies:[hobbySchema]
});

userSchema.index({email:1,username:1},{unique:true});
