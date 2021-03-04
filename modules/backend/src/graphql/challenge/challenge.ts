import { ChallengeStatus } from "../../types/schema";
import { formatIsoString } from "../../utils/dateUtils";
import { ChallengeParticipation, challenge_status } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";

import { Resolvers } from "../../types/resolvers";
import { UserValidator } from "../user/UserValidator";
import { ChallengeMapper } from "./ChallengeMapper";
import ChallengeValidator from "./ChallengeValidator";
import ValidationError from "../../utils/ValidationError";
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
      console.log(
        `ChallengeParticipation.markings : ${JSON.stringify(markings)}`
      );
      return markings;
    },
    challenge: async ({ challenge_id }, _, { loaders: { challengeLoader } }) => {
      const challenge = await challengeLoader.load(challenge_id);
      return challenge;
    }, 
    id: participation => participation.id,
    user: async ({ user_name }, _, { loaders: { userLoader }}) => {

      const user = await userLoader.load(user_name);
      return user;
    },
  },
  Challenge: {
    creator: async ({ creator_name }, _, { loaders: {userLoader}}) => {
      const user = await userLoader.load(creator_name || "");
      return user;
    },
    endDate: ({ end_date }) => end_date ? formatIsoString(end_date) : null,
    startDate: ({ start_date }) => start_date ? formatIsoString(start_date) : null,
    status: ({ status }) => status as ChallengeStatus,
    participations: async ({ id }, _, { loaders: { challengeParticipationsLoader }}) => {
      const participations = await challengeParticipationsLoader.load(id);
      console.log(
        `Challenge.participations : ${JSON.stringify(participations)}`
      );
      return participations;
    },
  },
  Marking: {
    date: ({ date }) => formatIsoString(date),
  },
  Query: {
    getChallenge: async (_, { id }, { prisma }) => {
      const challenge = await prisma.challenge.findUnique({
        where: { id }
      })
      return challenge;
    },
    getChallenges: async (_, __, { prisma }) => {
      console.log("getChallenges starting");
      const challenges = await prisma.challenge.findMany();
      console.log("getChallenges result: " + JSON.stringify(challenges));
      return challenges || [];
    },
    getParticipations: async (_, { challengeId }, { prisma }) => {
      const participations = await prisma.challengeParticipation.findMany({
        where: { challenge_id: challengeId }
      });
      return participations;
    },
    getMarkings: async (_, { participationId }, { prisma }) => {
      const markings = await prisma.marking.findMany({
        where: { participation_id: participationId }
      });
      return markings;
    }
  },
  Mutation: {
    addMarking: async (_, { participationId, marking }, { prisma, loaders }) => {
      console.log("addMarking args:", JSON.stringify(marking));
      // Validate marking
      const validate = await ChallengeValidator.validateAddMarking({ participationId, marking});
      if (validate instanceof ValidationError) throw validate;

      const createdMarking = await prisma.marking.create({
        data: ChallengeMapper.mapCreateMarkingInput(participationId, marking || {}),
      });
      // Clear markingsLoader cache
      loaders.markingsLoader.clear(participationId);

      return createdMarking;
    },
    editMarking: async (_, { id, marking }, { prisma, loaders }) => {
      console.log("editMarking args:", JSON.stringify(marking));
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
      const deletedMarkings = await prisma.$executeRaw(`DELETE FROM "Marking" WHERE id='${id}';`);
      if (deletedMarkings > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    createChallenge: async(_, { challenge }, { prisma }) => {
      const createChallenge = await prisma.challenge.create({
        data: ChallengeMapper.mapCreateChallengeInput(challenge)
      });
      return createChallenge;
    },
    updateChallenge: async (_, { id, args }, { prisma }) => {
      const updatedChallenge = await prisma.challenge.update({
        where: { id },
        data: ChallengeMapper.mapEditChallengeInput(args),
      });
      return updatedChallenge;
    },
    deleteChallenge: async (_, { id }, { prisma, loaders }) => {
      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByChallenge(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedChallenges = await prisma.$executeRaw(`DELETE FROM "Challenge" WHERE id='${id}';`);
      if (deletedChallenges > 0) return true; // If more than 0 rows are affected by above query
      return false;
    },
    createParticipation: async(_, { challengeId, userName  }, { prisma }) => {
      const participation = await prisma.challengeParticipation.create( {
        data: { challenge_id : challengeId, user_name: userName }
      });
      return participation;
    },
    deleteParticipation: async (_, { id }, { prisma, loaders }) => {
       // Clear partipationsLoader cache
       await loaderResetors.clearParticipationsCache(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedParticipations = await prisma.$executeRaw(`DELETE FROM "ChallengeParticipation" WHERE id='${id}';`);
      if (deletedParticipations > 0) return true; // If more than 0 rows are affected by above query
      return false;
    }
  },
};
