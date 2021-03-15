import { readFileSync } from "fs";
import path from "path";
import { formatIsoString } from "../../utils/dateUtils";

import { Resolvers } from "../../types/resolvers";
import { ChallengeMapper } from "./ChallengeMapper";
import ChallengeValidator from "./ChallengeValidator";
import { loaderResetors } from "../loaders";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "../../config.json";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

export const resolvers: Resolvers = {
  ChallengeParticipation: {
    markings: async ({ id }, _, { loaders: { markingsLoader } }) => {
      const markings = await markingsLoader.load(id);
      return markings;
    },
    challenge: async (
      { challenge_id },
      _,
      { loaders: { challengeLoader } }
    ) => {
      const result = await challengeLoader.load(challenge_id);
      if (result instanceof Error) throw result;

      return result;
    },
    id: (participation) => participation.id,
    user: async ({ user_name }, _, { loaders: { userLoader } }) => {
      const result = await userLoader.load(user_name);
      if (result instanceof Error) throw result;
      return result;
    },
  },
  Challenge: {
    creator: async ({ creator_name }, _, { loaders: { userLoader } }) => {
      const result = await userLoader.load(creator_name);
      if (result instanceof Error) throw result;

      return result;
    },
    endDate: ({ end_date }) => (end_date ? formatIsoString(end_date) : null),
    startDate: ({ start_date }) =>
      start_date ? formatIsoString(start_date) : null,
    status: ({ start_date, end_date }) =>
      ChallengeMapper.mapChallengeStatus(start_date, end_date),
    participations: async (
      { id },
      _,
      { loaders: { challengeParticipationsLoader } }
    ) => {
      const participations = await challengeParticipationsLoader.load(id);
      return participations;
    },
  },
  Marking: {
    date: ({ date }) => formatIsoString(date),
  },
  Query: {
    getChallenge: async (_, { id }, { prisma }) => {
      const challenge = await prisma.challenge.findFirst({
        where: { id },
      });
      return challenge;
    },
    getChallenges: async (_, args, { prisma }) => {
      const filters = ChallengeMapper.mapChallengeFilters(args);
      const challenges = await prisma.challenge.findMany({ where: filters });
      return challenges || [];
    },
    getUserParticipations: async (_, { userName }, { prisma }) => {
      const participations = await prisma.challengeParticipation.findMany({
        where: {
          AND: {
            user_name: userName,
            Challenge: { NOT: { name: NO_PARTICIPATION_MARKINGS_HOLDER_NAME } },
          },
        },
      });
      return participations;
    },
    getParticipation: async (_, { challengeId }, { prisma }) => {
      const participation = await prisma.challengeParticipation.findFirst({
        where: { challenge_id: challengeId },
      });
      return participation;
    },
    getMarkings: async (_, { participationId }, { prisma }) => {
      const markings = await prisma.marking.findMany({
        where: { participation_id: participationId },
      });
      return markings;
    },
    getUserTransferParticipation: async (_, { userName }, { prisma }) => {
      const transferParticipation = await prisma.challengeParticipation.findFirst(
        {
          where: {
            user_name: userName,
            Challenge: { name: NO_PARTICIPATION_MARKINGS_HOLDER_NAME },
          },
        }
      );
      return transferParticipation;
    },
  },
  Mutation: {
    addMarking: async (
      _,
      { participationId, marking },
      { prisma, loaders }
    ) => {
      // Validate marking
      await ChallengeValidator.validateAddMarking({
        participationId,
        marking,
      });

      const createdMarking = await prisma.marking.create({
        data: ChallengeMapper.mapCreateMarkingInput(
          participationId,
          marking || {}
        ),
      });
      // Clear markingsLoader cache
      loaders.markingsLoader.clear(participationId);

      return createdMarking;
    },
    editMarking: async (_, { id, marking }, { prisma, loaders }) => {
      // Check validity
      await ChallengeValidator.validateMarkingInput(marking);

      const editMarking = await prisma.marking.update({
        where: { id },
        data: ChallengeMapper.mapEditMarkingInput(marking),
      });
      // Clear markingsLoader cache
      loaders.markingsLoader.clear(editMarking.participation_id);
      return editMarking;
    },
    deleteMarking: async (_, { id }, { prisma, loaders }) => {
      // Clear markingsLoader cache
      await loaderResetors.clearMarkingsCache(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedMarkings = await prisma.$executeRaw(
        `DELETE FROM "Marking" WHERE id='${id}';`
      );
      if (deletedMarkings > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    transferUserMarkings: async (
      _,
      { challengeId, userName },
      { prisma, loaders }
    ) => {
      await ChallengeValidator.validateTransferUserMarking(
        userName,
        challengeId
      );

      const participationToUpdate = await prisma.challengeParticipation.findFirst(
        {
          where: {
            Challenge: { name: "NO_PARTICIPATION_MARKINGS_HOLDER" },
            user_name: userName,
          },
        }
      );
      if (!participationToUpdate)
        throw new Error(
          `transferUserMarkings NO_PARTICIPATION_MARKINGS_HOLDER-participation with user: ${userName}wasn't found`
        );
      // Update participation to point to new challenge
      await prisma.challengeParticipation.update({
        where: { id: participationToUpdate.id },
        data: { challenge_id: challengeId, user_name: userName },
      });

      await loaderResetors.clearParticipationsCache(
        participationToUpdate.id,
        loaders
      );
      return true; // Backup
    },
    createChallenge: async (_, { challenge }, { prisma, loaders }) => {
      const { creatorName, ...args } = challenge;
      await ChallengeValidator.validateCreateChallengeArgs(args);
      const createChallenge = await prisma.challenge.create({
        data: ChallengeMapper.mapCreateChallengeInput(challenge),
      });
      await loaderResetors.clearParticipationsCacheByChallenge(
        createChallenge.id,
        loaders
      );
      return createChallenge;
    },
    updateChallenge: async (_, { id, args }, { prisma, loaders }) => {
      await ChallengeValidator.validateChallengeArgs(args);
      const updatedChallenge = await prisma.challenge.update({
        where: { id },
        data: ChallengeMapper.mapEditChallengeInput(args),
      });
      // Clear challengeLoader cache by challenge id
      loaders.challengeLoader.clear(id);
      return updatedChallenge;
    },
    deleteChallenge: async (_, { id }, { prisma, loaders }) => {
      await ChallengeValidator.validateDeleteChallengeArgs(id);
      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByChallenge(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedChallenges = await prisma.$executeRaw(
        `DELETE FROM "Challenge" WHERE id='${id}';`
      );
      if (deletedChallenges > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    createParticipation: async (_, args, { prisma, loaders }) => {
      await ChallengeValidator.validateCreateParticipation(args);

      const { challengeId, userName } = args;
      const participation = await prisma.challengeParticipation.create({
        data: { challenge_id: challengeId, user_name: userName },
      });
      // Clear participationsLoader cache by created participation id
      await loaderResetors.clearParticipationsCache(participation.id, loaders);
      return participation;
    },
    deleteParticipation: async (_, args, { prisma, loaders }) => {
      await ChallengeValidator.validateDeleteParticipation(args);
      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByUser(
        args.userName,
        loaders
      );
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedParticipations = await prisma.$executeRaw(
        `DELETE FROM "ChallengeParticipation" WHERE user_name='${args.userName}' AND challenge_id='${args.challengeId}';`
      );
      if (deletedParticipations > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
  },
};
