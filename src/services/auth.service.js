import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserModel } from "../models/index.js";

const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

const validateUserInput = (userData) => {
  const { name, email, status, password } = userData;

  if (!name || !email || !password) {
    throw createHttpError(400, "Complete todos los campos");
  }

  if (!validator.isLength(name.trim(), { min: 2, max: 16 })) {
    throw createHttpError(
      400,
      "La longitud del nombre debe estar entre 2 y 16 caracteres"
    );
  }

  if (status && status.length > 64) {
    throw createHttpError(400, "Crea un estado menor a 64 caracteres");
  }

  if (!validator.isEmail(email.trim())) {
    throw createHttpError(400, "Agrega un correo válido");
  }

  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError(400, "Crea un password entre 6 y 128 caracteres");
  }
};

export const createUser = async (userData) => {
  try {
    validateUserInput(userData);

    const checkDb = await UserModel.findOne({ email: userData.email });
    if (checkDb) {
      throw createHttpError(
        409,
        "Agrega un diferente correo, este correo ya existe"
      );
    }

    const user = await new UserModel({
      name: userData.name.trim(),
      email: userData.email.trim(),
      picture: userData.picture || DEFAULT_PICTURE,
      status: userData.status || DEFAULT_STATUS,
      password: userData.password,
    }).save();

    return user;
  } catch (error) {
    throw error;
  }
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  // Chequear si el usuario existe
  if (!user) {
    throw createHttpError.NotFound("Credenciales Invalidas");
  }

  // compara el password
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createHttpError.NotFound("Credenciales Invalidas");
  }

  return user;
};
