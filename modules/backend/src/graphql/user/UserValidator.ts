import prisma from "../client";
import ValidationError from "../../utils/errors/ValidationError";

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
}
