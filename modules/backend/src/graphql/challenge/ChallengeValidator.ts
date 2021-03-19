import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  startOfDay,
} from "date-fns";
import { getEarliestMarking, getLatestMarking } from "../../utils/dateUtils";
import {
  CreateChallengeInput,
  MarkingCreateInput,
  MarkingUpdateInput,
  MutationAddMarkingArgs,
  UpdateChallengeInput,
} from "../../types/schema";
import ValidationError from "../../utils/errors/ValidationError";
import prisma from "../client";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "../../config.json";

export default class ChallengeValidator {
  public static async validateAddMarking(
    args: MutationAddMarkingArgs,
    userName: string
  ): Promise<void> {
    const participation = await prisma.challengeParticipation.findFirst({
      where: {
        id: args.participationId,
      },
    });
    if (!participation)
      throw new ValidationError(
        "Ilmoittautumista ei löytynyt, johon yritit lisätä merkkausta"
      );
    if (participation.user_name !== userName)
      throw new ValidationError(
        "Et voi lisätä merkkausta ilmoittautumiseen, joka ei ole sinun ilmoittautuminen"
      );
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

  public static async validateMarkingUpdateInput(
    id: string,
    input: MarkingCreateInput | MarkingUpdateInput,
    userName: string
  ): Promise<void> {
    const participation = await prisma.challengeParticipation.findFirst({
      where: {
        Marking: {
          some: {
            id,
          },
        },
      },
    });
    if (!participation)
      throw new ValidationError(
        "Ilmoittautumista ei löytynyt, jonka merkkausta yritit muokata"
      );
    if (participation.user_name !== userName)
      throw new ValidationError(
        "Et voi lisätä muokata merkkausta, joka ei ole sinun oma"
      );
    if (input.rating && (input.rating > 5 || input.rating < 1))
      throw new ValidationError(
        "Merkkauksen arvosana pitää olla numero välillä 1-5"
      );
    if (input.comment && input.comment.length > 2000) {
      throw new ValidationError(
        "Merkkauksen kommentti saa olla enintään 2000 merkkiä pitkä."
      );
    }
  }

  public static async validateMarkingInput(
    input: MarkingCreateInput | MarkingUpdateInput
  ): Promise<void> {
    if (input.rating && (input.rating > 5 || input.rating < 1))
      throw new ValidationError(
        "Merkkauksen arvosana pitää olla numero välillä 1-5"
      );
    if (input.comment && input.comment.length > 2000) {
      throw new ValidationError(
        "Merkkauksen kommentti saa olla enintään 2000 merkkiä pitkä."
      );
    }
  }

  public static async validateDeleteMarking(id: string, userName: string) {
    const participation = await prisma.challengeParticipation.findFirst({
      where: {
        Marking: {
          some: {
            id,
          },
        },
      },
    });
    if (!participation)
      throw new ValidationError(
        "Ilmoittautumista ei löytynyt, jonka merkkausta yritit poistaa"
      );
    if (participation.user_name !== userName)
      throw new ValidationError(
        "Et voi poistaa merkkausta, joka ei ole sinun oma"
      );
  }

  public static async validateCreateParticipation(
    challengeId: string,
    userName: string
  ) {
    const existingParticipation = await prisma.challengeParticipation.findFirst(
      {
        where: {
          AND: {
            challenge_id: challengeId,
            user_name: userName,
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
    challengeId: string,
    userName: string
  ) {
    const participation = await prisma.challengeParticipation.findFirst({
      where: {
        AND: {
          challenge_id: challengeId,
          user_name: userName,
        },
      },
    });
    if (!participation)
      throw new ValidationError("Poistettavaa ilmoittautumista ei löytynyt.");
    // TODO: args.userName should come from passport user, when passport is available
    if (participation.user_name !== userName)
      throw new ValidationError(
        "Et voi poistaa ilmoittautumista, joka ei ole omasi."
      );
  }

  public static async validateCreateChallengeArgs(args: CreateChallengeInput) {
    const { endDate, name } = args;
    this.validateChallengeArgs(args);
    const matchingChallenge = await prisma.challenge.findFirst({
      where: {
        name,
      },
    });
    if (matchingChallenge)
      throw new ValidationError(
        `Haaste nimellä '${name}' on jo olemassa. Valitse eri nimi`
      );
    if (endDate && isBefore(new Date(endDate), new Date()))
      throw new ValidationError(
        "Et voi luoda haastetta jo menneelle päivämäärälle"
      );
  }

  public static async validateUpdateChallenge(
    args: UpdateChallengeInput,
    challengeId: string,
    userName: string
  ) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge)
      throw new ValidationError("Muokattavaa haastetta ei löytynyt");
    if (challenge.creator_name !== userName)
      throw new ValidationError("Et voi muokata haastetta, joka ei ole omasi");
    this.validateChallengeArgs(args);
  }

  public static validateChallengeArgs({
    name,
    description,
    endDate: endDateString,
    startDate: startDateString,
  }: UpdateChallengeInput) {
    if (name && name.length === 0) {
      throw new ValidationError("Nimi ei saa tyhjä.");
    }
    if (description != null && description.length === 0)
      throw new ValidationError("Kuvaus ei saa olla tyhjä.");
    if (
      (!startDateString && endDateString) ||
      (!endDateString && startDateString)
    )
      throw new ValidationError(
        "Sinun pitää määritellä joko molemmat, alku- ja loppupäivämäärä, tai ei kumpaakaan."
      );
    if (startDateString && endDateString) {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      if (!isValid(startDate))
        throw new ValidationError("Alkupäivämäärä ei ole oikeassa muodossa.");
      if (!isValid(endDate))
        throw new ValidationError("Loppupäivämäärä ei ole oikeassa muodossa.");
      if (!isAfter(endDate, startDate) && !isSameDay(startDate, endDate))
        throw new ValidationError(
          "Loppupäivämäärän pitää tulla alkupäivämäärän jälkeen."
        );
    }
  }

  public static async validateDeleteChallengeArgs(
    id: string,
    userName: string
  ) {
    const challenge = await prisma.challenge.findFirst({
      where: {
        id,
      },
    });
    if (!challenge) throw new ValidationError("Haastetta ei ole olemasas");
    if (challenge.creator_name !== userName)
      throw new ValidationError("Et voi poistaa haastetta, joka ei ole omasi");
    const challengeParticipations = await prisma.challengeParticipation.findMany(
      {
        where: {
          challenge_id: challenge.id,
        },
      }
    );
    const otherThanUserParticipations = challengeParticipations.filter(
      (it) => it.user_name !== challenge.creator_name
    );
    // If challenge has other participations than creator participation, don't allow delete
    if (otherThanUserParticipations.length > 0)
      throw new ValidationError(
        "Et voi poistaa haastetta, jossa on myös muiden ilmoittautumisia"
      );
  }

  public static async validateTransferUserMarking(
    userName: string,
    challengeId: string
  ) {
    // Fetch all markings of user that are in NO_PARTICIPATION_MARKINGS_HOLDER
    const userMarkings = await prisma.marking.findMany({
      where: {
        ChallengeParticipation: {
          Challenge: { name: NO_PARTICIPATION_MARKINGS_HOLDER_NAME },
          user_name: userName,
        },
      },
    });
    // Return false if there are no markings to transfer
    if (userMarkings.length === 0)
      throw new ValidationError(
        `Ei löytynyt siirrettäviä merkkauksia käyttäjälle ${userName}`
      );

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge)
      throw new ValidationError(
        "Haastetta, johon merkkaukset kuului siirtää, ei löytynyt"
      );
    const { start_date: startDate, end_date: endDate } = challenge;
    if (!startDate || !endDate)
      throw new ValidationError(
        "Merkkauksia ei voi siirtää haasteeseen, jolla ei ole asetettu päivämäärää"
      );
    const latestMarking = getLatestMarking(userMarkings);
    const latestMarkingDate = latestMarking
      ? new Date(latestMarking.date)
      : undefined;
    const earliestMarking = getEarliestMarking(userMarkings);
    const earliestMarkingDate = earliestMarking
      ? new Date(earliestMarking.date)
      : undefined;
    if (
      (earliestMarkingDate && isBefore(earliestMarkingDate, startDate)) ||
      (latestMarkingDate && isAfter(latestMarkingDate, endDate))
    ) {
      throw new ValidationError(
        `Haasteen aikaväli ei kattanut merkkauksiesi päivämääriä. Valitse haaste, joka kattaa kaikki merkkauksesi.`
      );
    }
  }
}
