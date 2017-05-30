"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hobbySchema_1 = require("./hobbySchema");
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    dateCreated: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    hobbies: [hobbySchema_1.hobbySchema]
});
exports.userSchema.index({ email: 1, username: 1 }, { unique: true });
