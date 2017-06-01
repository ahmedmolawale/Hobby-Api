"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.hobbySchema = new mongoose_1.Schema({
    dateCreated: { type: String },
    hobby: { type: String }
});
