import { Document, ObjectId } from "mongoose";
import { Request } from "express";
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroup extends Document {
  _id: string;
  name: string;
  description?: string;
  createdBy: ObjectId; // User ID of the creator
  members: string[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IRequest extends Request {
  user?: IUser;
}
