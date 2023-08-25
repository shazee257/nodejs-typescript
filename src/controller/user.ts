import { Request, Response, NextFunction } from "express";
import { generateResponse, parseBody } from "../utils/helper";
import {
  createUser,
  findUser,
  findUserWithPassword,
  generateRefreshToken,
  generateToken,
  getAllUsers,
  updateUser,
} from "../models/user";
import { STATUS_CODES } from "../utils/constant";
import { hash, compare } from "bcrypt";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user";
import { getUsersQuery } from "./queries/user";
import { IUser } from "../types/user";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = parseBody(req.body);
  // const body: Record<string, any> = parseBody(req.body);

  // Joi validation
  // const { error } = registerUserValidation.validate(body);
  // if (error)
  //   return next({
  //     statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
  //     message: error.details[0].message,
  //   });

  try {
    const userExists = await findUser({ email: body?.email });
    if (userExists)
      return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "User already exists",
      });

    // hash password
    const hashedPassword = await hash(body.password, 10);
    body.password = hashedPassword;

    const newUser = await createUser(body);

    const accessToken = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    req.session = { accessToken };

    // // update user with refreshToken
    const user = await updateUser(
      { _id: newUser._id },
      { $set: { refreshToken } }
    );

    generateResponse(
      {
        newUser,
        accessToken,
        refreshToken,
      },
      "Register successful",
      res
    );
  } catch (error) {
    next(new Error((error as Error).message));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: Record<string, any> = parseBody(req.body);

  // Joi validation
  const { error } = loginUserValidation.validate(body);
  if (error)
    return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });

  try {
    const userObj = await findUserWithPassword({ email: body.email });
    if (!userObj)
      return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "User not exist",
      });

    const isMatch = await compare(body.password, userObj.password);
    if (!isMatch)
      return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Invalid password",
      });

    const accessToken = generateToken(userObj);
    const refreshToken = generateRefreshToken(userObj);

    req.session = { accessToken };

    // update user with refreshToken
    const user = await updateUser(
      { _id: userObj._id },
      { $set: { refreshToken } }
    );

    generateResponse(
      {
        user,
        accessToken,
        refreshToken,
      },
      "Register successful",
      res
    );
  } catch (error) {
    next(new Error((error as Error).message));
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUser({ email: "user1@mailinator.com" });
    generateResponse(user, "Register successful", res);
  } catch (error) {
    next(new Error((error as Error).message));
  }
};

export const fetchAllUsers = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const { search = "" } = req.query;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const query = getUsersQuery(userId, search);

  try {
    const users = await getAllUsers({
      query,
      page,
      limit,
      responseKey: "users",
    });
    if (users?.users.length === 0) {
      generateResponse(null, "Users not found", res);
      return;
    }
    generateResponse(users, "Users found", res);
  } catch (error) {
    next(new Error((error as Error).message));
  }
};
