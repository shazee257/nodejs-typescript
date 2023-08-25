import { Types } from "mongoose";
import { ROLES } from "../../utils/constant";

// get all users except admin and current user (active users)
export const getUsersQuery = (userId: string, search: string) => {
  return [
    {
      $match: {
        $and: [
          //   { role: ROLES.USER },
          { _id: { $ne: new Types.ObjectId(userId) } },
          //   { isActive: true },
          //   {
          //     $or: [
          //       { firstName: { $regex: search, $options: "i" } },
          //       { lastName: { $regex: search, $options: "i" } },
          //       { email: { $regex: search, $options: "i" } },
          //     ],
          //   },
        ],
      },
    },
    // { $sort: { createdAt: -1 } },
    { $project: { refreshToken: 0, password: 0, __v: 0 } },
  ];
};
