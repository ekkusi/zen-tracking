import { addDays, format, startOfDay } from "date-fns";
import {
  MarkingInput,
  MutationAddMarkingArgs,
  MutationCreateParticipationArgs,
  MutationDeleteParticipationArgs,
} from "../../types/schema";
import ValidationError from "../../utils/ValidationError";
import prisma from "../client";

export default class ChallengeValidator {
  public static async validateAddMarking(
    args: MutationAddMarkingArgs
  ): Promise<void> {
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
      throw new ValidationError(
        `Olet jo merkannut päivälle ${format(dateToCheck, "yyyy-MM-dd")}.`
      );
    }
    if (args.marking) {
      ChallengeValidator.validateMarkingInput(args.marking);
    }
  }

  public static async validateMarkingInput(input: MarkingInput): Promise<void> {
    if (input.comment && input.comment.length > 2000) {
      throw new ValidationError(
        `Merkkauksen kommentti saa olla enintään 2000 merkkiä pitkä.`
      );
    }
  }

  public static async validateCreateParticipation(
    args: MutationCreateParticipationArgs
  ) {
    const existingParticipation = await prisma.challengeParticipation.findFirst(
      {
        where: {
          AND: {
            challenge_id: args.challengeId,
            user_name: args.userName,
          },
        },
      }
    );
    if (existingParticipation)
      throw new ValidationError(
        "Et voi ilmoittautua haasteeseen, johon olet jo ilmoittautunut."
      );
  }

  public static async validateDeleteParticipation(
    args: MutationDeleteParticipationArgs
  ) {
    const participation = await prisma.challengeParticipation.findFirst({
      where: {
        AND: {
          challenge_id: args.challengeId,
          user_name: args.userName,
        },
      },
    });
    if (!participation)
      throw new ValidationError("Poistettavaa ilmoittautumista ei löytynyt.");
    // TODO: args.userName should come from passport user, when passport is available
    if (participation.user_name !== args.userName)
      throw new ValidationError(
        "Et voi poistaa ilmoittautumista, joka ei ole omasi."
      );
  }
}
