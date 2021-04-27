import { Prisma, User as PrismaUser } from "@prisma/client";
import { AuthenticatedUser } from "../../types/customContext";
import { MutationEditUserArgs, MutationRegisterArgs } from "../../types/schema";
import { hash } from "../../utils/auth";

export class UserMapper {
  public static mapAuthenticatedUser(user: PrismaUser): AuthenticatedUser {
    return {
      name: user.name,
      isPrivate: user.is_private,
      email: user.email,
    };
  }

  public static async mapEditUserInput({
    email,
    passwordInput,
    nameInput,
    isPrivate,
  }: MutationEditUserArgs): Promise<Prisma.UserUpdateInput> {
    return {
      email,
      password: passwordInput
        ? await hash(passwordInput.newPassword)
        : undefined,
      name: nameInput.newName ? nameInput.newName : undefined,
      is_email_verified: email !== undefined ? false : undefined,
      is_private:
        isPrivate !== undefined && isPrivate !== null ? isPrivate : undefined,
    };
  }

  public static async mapCreateUserInput({
    email,
    name,
    password,
    isPrivate,
  }: MutationRegisterArgs): Promise<Prisma.UserCreateInput> {
    return {
      name,
      email,
      password: await hash(password),
      is_private: isPrivate,
    };
  }
}
