import { addDays, format, startOfDay } from "date-fns";
import { MarkingInput, MutationAddMarkingArgs } from "../../types/schema";
import ValidationError from "../../utils/ValidationError";
import prisma from "../client";

export default class ChallengeValidator {
  public static async validateAddMarking(
    args: MutationAddMarkingArgs
  ): Promise<ValidationError | null> {
    let dateToCheck;
    // If date is given, use that, otherwise fallback to current day
    if (args.marking?.date) dateToCheck = new Date(args.marking.date);
    else dateToCheck = new Date();
    const startOfDayDate = startOfDay(dateToCheck);

    const nextDayDate = addDays(startOfDayDate, 1);
    const markingInBetween = await prisma.marking.findFirst({
      where: {
        participation_id: args.participationId,
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
      const validateInput = ChallengeValidator.validateMarkingInput(
        args.marking
      );
      if (validateInput instanceof ValidationError) return validateInput;
    }
    return null;
  }

  public static async validateMarkingInput(
    input: MarkingInput
  ): Promise<ValidationError | null> {
    if (input.comment && input.comment.length > 2000) {
      return new ValidationError(
        `Merkkauksen kommentti saa olla enintään 2000 merkkiä pitkä.`
      );
    }
    return null;
  }
}
