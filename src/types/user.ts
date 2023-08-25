export interface IUser {
  _id?: string;
  email: string;
  role: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  refreshToken: string;
  fcmToken: string;
  createdAt: Date;
  updatedAt: Date;
}
