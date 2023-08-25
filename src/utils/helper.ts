import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import { Document, Model, Aggregate, AggregatePaginateModel } from "mongoose";

export const generateResponse = (
  data: Record<string, any> | null,
  message: string,
  res: Response,
  code: number = 200
): Response => {
  return res.status(code).json({
    message,
    data,
  });
};

export const parseBody = (body: Record<string, any> | string) => {
  let obj: Record<string, any>;
  if (typeof body === "object") obj = body;
  else obj = JSON.parse(body);
  return obj;
};

export const generateRandomOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const upload = (folderName: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req: Request, file: Express.Multer.File, cb) {
        const path = `uploads/${folderName}/`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
      },

      // By default, multer removes file extensions so let's add them back
      filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "." + file.originalname.split(".").pop());
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB //
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
      ) {
        return cb(null, true);
      }

      return cb(null, false);
    },
  });
};

interface PaginationOptions {
  page?: number;
  limit?: number;
  query?: any[];
  populate?: string;
  select?: string;
  sort?: any;
}

interface PaginationResult<T> {
  data: T[];
  pagination: any; // You can define a proper pagination interface if needed
}

export const getMongooseAggregatePaginatedData = async <T extends Document>(
  model: any,
  {
    page = 1,
    limit = 10,
    query = [],
    populate = "",
    select = "-password",
    sort = { createdAt: -1 },
  }: PaginationOptions
): Promise<PaginationResult<T>> => {
  const options = {
    select,
    sort,
    populate,
    lean: true,
    page,
    limit,
    customLabels: {
      totalDocs: "totalItems",
      docs: "data",
      limit: "perPage",
      page: "currentPage",
      meta: "pagination",
    },
  };

  const myAggregate = model.aggregate(query);
  const { data, pagination } = await model?.aggregatePaginate(
    myAggregate,
    options
  );

  return { data, pagination };
};

// pagination with mongoose paginate library
// export const getMongoosePaginatedData = async ({
//   model,
//   page = 1,
//   limit = 10,
//   query = {},
//   populate = "",
//   select = "-password",
//   sort = { createdAt: -1 },
// }: {model: }) => {
//   const options = {
//     select,
//     sort,
//     populate,
//     lean: true,
//     page,
//     limit,
//     customLabels: {
//       totalDocs: "totalItems",
//       docs: "data",
//       limit: "perPage",
//       page: "currentPage",
//       meta: "pagination",
//     },
//   };

//   const { data, pagination } = await model.paginate(query, options);
//   return { data, pagination };
// };

// // aggregate pagination with mongoose paginate library
// export const getMongooseAggregatePaginatedData = async ({
//   model,
//   page = 1,
//   limit = 10,
//   query = [],
//   populate = "",
//   select = "-password",
//   sort = { createdAt: -1 },
// }) => {
//   const options = {
//     select,
//     sort,
//     populate,
//     lean: true,
//     page,
//     limit,
//     customLabels: {
//       totalDocs: "totalItems",
//       docs: "data",
//       limit: "perPage",
//       page: "currentPage",
//       meta: "pagination",
//     },
//   };

//   const myAggregate = model.aggregate(query);
//   const { data, pagination } = await model.aggregatePaginate(
//     myAggregate,
//     options
//   );
//   return { data, pagination };
// };
