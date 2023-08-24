import { Document } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  email: string;
  password: string;
  refreshToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}
