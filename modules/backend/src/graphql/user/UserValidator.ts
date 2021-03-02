import { MutationAddMarkingArgs } from "@/types/user";
import prisma from "../client";

export class UserValidator {
  public static async validateAddMarking(
    args: MutationAddMarkingArgs
  ): Promise<boolean | ValidationError> {
    const { userName, marking } = args;
  }
}
