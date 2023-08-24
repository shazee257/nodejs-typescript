import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongooseAggregatePaginatedData } from "../utils/helper";
import { sign } from "jsonwebtoken";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, require: true, select: false },
    refreshToken: { type: String, require: true, select: false },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model<IUser>("User", userSchema);

// create new user
export const createUser = (obj: Record<string, any>): Promise<IUser> => {
  return UserModel.create(obj);
};

// find user by query
export const findUser = (query: Record<string, any>): Promise<IUser | null> => {
  return UserModel.findOne(query);
};

// // find users by query without pagination
// export const findUsers = (
//   query: Record<string, any>
// ): Promise<IUser[] | null> => {
//   return UserModel.find(query);
// };

// update user
export const updateUser = (
  query: Record<string, any>,
  obj: Record<string, any>
) => {
  return UserModel.findOneAndUpdate(query, obj, { new: true });
};

// // get all users
// exports.getAllUsers = async ({
//   query,
//   page,
//   limit,
//   responseKey = "data",
// }: {
//   query: any[];
//   page: number;
//   limit: number;
//   responseKey?: string;
// }) => {
//   const { data, pagination } = await getMongooseAggregatePaginatedData(
//     UserModel,
//     { query, page, limit }
//   );

//   return { [responseKey]: data, pagination };
// };

export const generateToken = (user: IUser) => {
  const { JWT_EXPIRATION, JWT_SECRET } = process.env;

  const token = sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRATION }
  );

  return token;
};

// generate refresh token
export const generateRefreshToken = (user: IUser): string => {
  const refreshToken = sign(
    { id: user._id },
    process.env.REFRESH_JWT_SECRET as string,
    {
      expiresIn: process.env.REFRESH_JWT_EXPIRATION,
    }
  );

  return refreshToken;
};
