import { User } from "@prisma/client";
import prisma from "../client";
import ValidationError from "../../utils/errors/ValidationError";
import { compare } from "../../utils/auth";
import { MutationEditUserArgs } from "../../types/schema";
import { AuthenticatedUser } from "../../types/customContext";

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
    nameOrEmail: string,
    password: string
  ): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            name: nameOrEmail,
          },
          {
            email: nameOrEmail,
          },
        ],
      },
    });
    if (!user) {
      throw new ValidationError(`Käyttäjää ${nameOrEmail} ei löytynyt`);
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new ValidationError("Antamasi salasana on väärä");
    }

    return user;
  }

  public static async validateEditUser(
    { name, passwordInput, email }: MutationEditUserArgs,
    user: AuthenticatedUser
  ): Promise<void> {
    if (email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userWithSameEmail && userWithSameEmail.name !== user.name) {
        throw new ValidationError(`Sähköposti ${email} on jo käytössä`);
      }
    }

    if (name && name !== user.name) {
      const userWithSameName = await prisma.user.findUnique({
        where: {
          name,
        },
      });
      if (userWithSameName) {
        throw new ValidationError(`Nimi ${name} on jo käytössä`);
      }
    }

    const userWithPassword = await prisma.user.findUnique({
      where: {
        name: user.name,
      },
    });

    if (!userWithPassword) {
      throw new ValidationError(`Käyttäjää nimellä ${user.name} ei löytynyt`);
    }

    if (passwordInput) {
      const checkPassword = await compare(
        passwordInput.currentPassword,
        userWithPassword.password
      );
      if (!checkPassword)
        throw new ValidationError(`Antamasi alkuperäinen salasana oli väärä`);
    }
  }
}
