import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

const API_PATH = "/api/v1/auth";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: `${API_PATH}/refreshtoken`,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.json({
      message: "Registrado exitosamente",

      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const accessToken = await signUser(email, password);
    res.json({ access_token: accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: `${API_PATH}/refreshtoken` });
    res.json({
      message: "Cerrar sesión exitosa",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    const refresh_token = req.cookies.refreshtoken;

    if (!refresh_token) {
      throw createHttpError.Unauthorized(
        "Token de actualización no proporcionado"
      );
    }

    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await findUser(check.userId);
    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      message: "Token de actualización exitoso",
      
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};
