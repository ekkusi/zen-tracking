import { readFileSync } from "fs";
import path from "path";
import ValidationError from "../../utils/ValidationError";
import { formatIsoString } from "../../utils/dateUtils";

import { Resolvers } from "../../types/resolvers";
import { ChallengeMapper } from "./ChallengeMapper";
import ChallengeValidator from "./ChallengeValidator";
import { loaderResetors } from "../loaders";

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
      const challenge = await challengeLoader.load(challenge_id);
      return challenge;
    },
    id: (participation) => participation.id,
    user: async ({ user_name }, _, { loaders: { userLoader } }) => {
      const user = await userLoader.load(user_name);
      return user;
    },
  },
  Challenge: {
    creator: async ({ creator_name }, _, { loaders: { userLoader } }) => {
      const user = await userLoader.load(creator_name);
      return user;
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
      const challenge = await prisma.challenge.findUnique({
        where: { id },
      });
      return challenge;
    },
    getChallenges: async (_, __, { prisma, loaders }) => {
      loaders.userLoader.clearAll();
      loaders.challengeParticipationsLoader.clearAll();
      loaders.challengeLoader.clearAll();
      const challenges = await prisma.challenge.findMany();
      return challenges || [];
    },
    getUserParticipations: async (_, { userName }, { prisma }) => {
      const participations = await prisma.challengeParticipation.findMany({
        where: { user_name: userName },
      });
      return participations;
    },
    getMarkings: async (_, { participationId }, { prisma }) => {
      const markings = await prisma.marking.findMany({
        where: { participation_id: participationId },
      });
      return markings;
    },
  },
  Mutation: {
    addMarking: async (
      _,
      { participationId, marking },
      { prisma, loaders }
    ) => {
      console.log("addMarking args:", JSON.stringify(marking));
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
      console.log("editMarking args:", JSON.stringify(marking));
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
    createChallenge: async (_, { challenge }, { prisma }) => {
      const { creatorName, ...args } = challenge;
      console.log(`Create challenge args:${JSON.stringify(args)}`);
      ChallengeValidator.validateChallengeArgs(args);
      const createChallenge = await prisma.challenge.create({
        data: ChallengeMapper.mapCreateChallengeInput(challenge),
      });
      // Create participation to challenge creator automatically
      await prisma.challengeParticipation.create({
        data: {
          challenge_id: createChallenge.id,
          user_name: creatorName,
        },
      });
      return createChallenge;
    },
    updateChallenge: async (_, { id, args }, { prisma }) => {
      console.log(`updateChallenge args: ${JSON.stringify(args)}`);
      ChallengeValidator.validateChallengeArgs(args);
      const updatedChallenge = await prisma.challenge.update({
        where: { id },
        data: ChallengeMapper.mapEditChallengeInput(args),
      });
      return updatedChallenge;
    },
    deleteChallenge: async (_, { id }, { prisma, loaders }) => {
      throw new ValidationError("Et saa tehdä poistoa!!");
      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByChallenge(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedChallenges = await prisma.$executeRaw(
        `DELETE FROM "Challenge" WHERE id='${id}';`
      );
      if (deletedChallenges > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    createParticipation: async (_, args, { prisma }) => {
      await ChallengeValidator.validateCreateParticipation(args);
      const { challengeId, userName } = args;
      const participation = await prisma.challengeParticipation.create({
        data: { challenge_id: challengeId, user_name: userName },
      });
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
      console.log(`Deleted participations count: ${deletedParticipations}`);
      if (deletedParticipations > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
  },
};
