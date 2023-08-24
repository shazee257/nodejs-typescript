import { Request, Response, NextFunction } from "express";
import { generateResponse, parseBody } from "../utils/helper";
import {
  createUser,
  findUser,
  generateRefreshToken,
  generateToken,
  updateUser,
} from "../models/user";
import { STATUS_CODES } from "../utils/constant";
import { hash, compare } from "bcrypt";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: Record<string, any> = parseBody(req.body);

  // Joi validation
  const { error } = registerUserValidation.validate(body);
  if (error)
    return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });

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
    const user = await findUser({ email: body.email });
    if (user)
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

    // // // update user with refreshToken
    // const user = await updateUser(
    //   { _id: newUser._id },
    //   { $set: { refreshToken } }
    // );

    // generateResponse(
    //   {
    //     newUser,
    //     accessToken,
    //     refreshToken,
    //   },
    //   "Register successful",
    //   res
    // );
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
