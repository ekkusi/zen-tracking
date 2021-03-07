import ValidationError from "../../utils/ValidationError";

export default class UserValidator {
  public static validateCreateUser(name: string): ValidationError | null {
    // Validate name to not be not-authorized, this is reserved for frontend default user to route back to login page
    if (name === "not-authorized")
      return new ValidationError(
        "not-authorized name is reserved keyword, choose different name"
      );
    return null;
  }
}
