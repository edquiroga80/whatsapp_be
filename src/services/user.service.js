import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user)
    throw createHttpError.BadRequest("Por Favor llene todos los campos");
  return user;
};
