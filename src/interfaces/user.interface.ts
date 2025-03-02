import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}
