import { User } from "@prisma/client";
import prisma from "../client";
import ValidationError from "../../utils/errors/ValidationError";
import { compare } from "../../utils/auth";

export default class UserValidator {
  public static async validateCreateUser(name: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { name },
    });
    // Validate name to not be not-authorized, this is reserved for frontend default user to route back to login page
    if (user || name === "not-authorized") {
      throw new ValidationError("Antamasi nimi on varattu, valitse eri nimi");
    }
  }

  public static async validateLoginUser(
    name: string,
    password: string
  ): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { name },
    });
    if (!user) {
      throw new ValidationError(`Käyttäjää nimellä ${name} ei löytynyt`);
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new ValidationError("Antamasi salasana on väärä");
    }

    return user;
  }
}
