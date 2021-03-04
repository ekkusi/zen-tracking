import { addDays, format, startOfDay } from "date-fns";
import { MutationAddMarkingArgs } from "../../types/schema";
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
    return true;
  }
}
