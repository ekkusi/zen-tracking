import { MarkingInput, MutationAddMarkingArgs } from "@/types/user";
import { addDays, format, startOfDay } from "date-fns";
import ValidationError from "../../utils/ValidationError";
import prisma from "../client";

export class UserValidator {
  public static async validateAddMarking(
    args: MutationAddMarkingArgs
  ): Promise<boolean | ValidationError> {
    let dateToCheck;
    // If date is given, use that, otherwise fallback to current day
    if (args.marking?.date) dateToCheck = new Date(args.marking.date);
    else dateToCheck = new Date();
    const startOfDayDate = startOfDay(dateToCheck);

    const nextDayDate = addDays(startOfDayDate, 1);
    const markingInBetween = await prisma.marking.findFirst({
      where: {
        user_name: args.userName,
        date: {
          lte: nextDayDate.toISOString(),
          gte: startOfDayDate.toISOString(),
        },
      },
    });
    if (markingInBetween) {
      return new ValidationError(
        `Olet jo merkannut päivälle ${format(dateToCheck, "yyyy-MM-dd")}.`
      );
    }

    if (args.marking) {
      const validateInput = UserValidator.validateMarkingInput(args.marking);
      if (typeof validateInput !== "boolean") return validateInput;
    }

    return true;
  }

  public static async validateMarkingInput(
    input: MarkingInput
  ): Promise<boolean | ValidationError> {
    if (input.comment && input.comment.length > 2000) {
      return new ValidationError(
        `Merkkauksen kommentti saa olla enintään 2000 merkkiä pitkä.`
      );
    }
    return true;
  }
}
