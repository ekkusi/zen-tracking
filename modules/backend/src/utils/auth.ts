import bcrypt from "bcrypt";
import { addDays } from "date-fns";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/customContext";
import AuthenticationError from "./errors/AuthenticationError";
import { checkIfIsUser } from "./user";

const saltRounds = 10;

export const hash = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const compare = (
  password: string,
  hashString: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashString);
};

export const createAccessToken = (user: AuthenticatedUser): string => {
  const token = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY!, {
    expiresIn: "15min",
  });
  return token;
};

const REFRESH_TOKEN_EXPIRATION_IN_DAYS = 30;

export const createRefreshToken = (user: AuthenticatedUser): string => {
  const token = jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY!, {
    expiresIn: `${REFRESH_TOKEN_EXPIRATION_IN_DAYS}d`,
  });
  return token;
};

export const createRefreshTokenCookie = (token: string, res: Response) => {
  res.cookie("jubbiduu", token, {
    httpOnly: true,
    expires: addDays(new Date(), REFRESH_TOKEN_EXPIRATION_IN_DAYS),
  });
};

export const createRefreshAndAccessTokens = (
  user: AuthenticatedUser,
  res: Response
): string => {
  createRefreshTokenCookie(createRefreshToken(user), res);
  return createAccessToken(user);
};

export const parseAndVerifyToken = (
  bearerToken: string
): AuthenticatedUser | null => {
  const parsedToken = bearerToken.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(
      parsedToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY!
    ) as any;
    if (typeof decoded !== "object" || !checkIfIsUser(decoded.user)) {
      throw new AuthenticationError(
        "Access token keksi ei palauttanut oikeita tietoja"
      );
    }
    const { user }: { user: AuthenticatedUser } = decoded;
    return user;
  } catch (error) {
    return null;
  }
};
