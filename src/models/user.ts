import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongooseAggregatePaginatedData } from "../utils/helper";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model("User", userSchema);

// create new user
exports.createUser = (obj: Record<string, any>) => UserModel.create(obj);

// find user by query
exports.findUser = (query: Record<string, any>) => UserModel.findOne(query);

// find users by query without pagination
exports.findUsers = (query: Record<string, any>) => UserModel.find(query);

// update user
exports.updateUser = (query: Record<string, any>, obj: Record<string, any>) =>
  UserModel.findOneAndUpdate(query, obj, { new: true });

// get all users
exports.getAllUsers = async ({
  query,
  page,
  limit,
  responseKey = "data",
}: {
  query: any[];
  page: number;
  limit: number;
  responseKey?: string;
}) => {
  const { data, pagination } = await getMongooseAggregatePaginatedData(
    UserModel,
    { query, page, limit }
  );

  return { [responseKey]: data, pagination };
};
