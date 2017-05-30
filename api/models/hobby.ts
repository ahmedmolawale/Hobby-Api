
import {Document} from "mongoose"
export interface IHobbyModel extends Document {
    hobby:string,
    dateCreated:string
} 