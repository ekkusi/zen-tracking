import { readFileSync } from "fs";
import path from "path";
import { Marking, Prisma } from "@prisma/client";
import AuthenticationError from "../../utils/errors/AuthenticationError";
import { formatIsoString } from "../../utils/dateUtils";

import { Resolvers } from "../../types/resolvers";
import { ChallengeMapper } from "./ChallengeMapper";
import ChallengeValidator from "./ChallengeValidator";
import { loaderResetors } from "../loaders";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "../../config.json";
import { SharedMapper } from "../shared/SharedMapper";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

export const resolvers: Resolvers = {
  ChallengeParticipation: {
    markings: async (
      { id, user_name },
      _,
      { loaders: { markingsLoader }, user }
    ) => {
      const markings = await markingsLoader.load(id);
      const notPrivateOrCurrentUserMarkings = markings.filter(
        (it) => !it.is_private || user_name === user?.name
      );
      return notPrivateOrCurrentUserMarkings;
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
    isPrivate: ({ is_private }) => is_private,
    endDate: ({ end_date }) => (end_date ? formatIsoString(end_date) : null),
    startDate: ({ start_date }) =>
      start_date ? formatIsoString(start_date) : null,
    createdAt: ({ created_at }) => formatIsoString(created_at),
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
    createdAt: ({ created_at }) => formatIsoString(created_at),
    status: ({ start_date, end_date }) =>
      ChallengeMapper.mapChallengeStatus(start_date, end_date),
    participations: async (
      { id },
      _,
      { loaders: { challengeParticipationsLoader }, user }
    ) => {
      const participations = await challengeParticipationsLoader.load(id);
      const notPrivateOrCurrentUserParticipations = participations.filter(
        (it) => !it.is_private || it.user_name === user?.name
      );
      return notPrivateOrCurrentUserParticipations;
    },
    isPrivate: ({ is_private }) => is_private,
  },
  Marking: {
    date: ({ date }) => formatIsoString(date),
    photoUrl: ({ photo_url }) => photo_url,
    isPrivate: ({ is_private }) => is_private,
  },
  Query: {
    getChallenge: async (_, { id }, { prisma, user }) => {
      const filters = SharedMapper.notPrivateFilterMapper<Prisma.ChallengeWhereInput>(
        { id },
        { creator_name: user?.name }
      );
      const challenge = await prisma.challenge.findFirst({
        where: filters,
      });
      return challenge;
    },
    getChallenges: async (_, args, { prisma, user }) => {
      const filters = ChallengeMapper.mapChallengeFilters(args.filters || {});
      const allFilters = SharedMapper.notPrivateFilterMapper<Prisma.ChallengeWhereInput>(
        filters,
        { creator_name: user?.name }
      );
      const challenges = await prisma.challenge.findMany({
        where: allFilters,
      });
      return challenges || [];
    },
    getParticipations: async (_, args, { prisma, user }) => {
      if (!user) throw new AuthenticationError();
      // Filter by user name and so that participation is not transfer participation
      const filters = ChallengeMapper.mapParticipationsFilters(args);
      const allFilters = SharedMapper.notPrivateFilterMapper<Prisma.ChallengeParticipationWhereInput>(
        filters,
        { user_name: user.name }
      );
      const participations = await prisma.challengeParticipation.findMany({
        where: allFilters,
      });
      return participations;
    },
    getParticipation: async (_, { id }, { prisma, user }) => {
      const filters = SharedMapper.notPrivateFilterMapper<Prisma.ChallengeParticipationWhereInput>(
        { id },
        { user_name: user?.name }
      );
      const participation = await prisma.challengeParticipation.findFirst({
        where: filters,
      });
      return participation;
    },
    getMarkings: async (_, { participationId }, { prisma, user }) => {
      const filters = SharedMapper.notPrivateFilterMapper<Prisma.MarkingWhereInput>(
        { participation_id: participationId },
        { ChallengeParticipation: { user_name: user?.name } }
      );
      const markings = await prisma.marking.findMany({
        where: filters,
      });
      return markings;
    },
    getUserTransferParticipation: async (_, __, { prisma, user }) => {
      if (!user) throw new AuthenticationError();
      const transferParticipation = await prisma.challengeParticipation.findFirst(
        {
          where: {
            user_name: user.name,
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
      { prisma, loaders, user }
    ) => {
      if (!user) throw new AuthenticationError();
      // Validate marking
      await ChallengeValidator.validateAddMarking(
        {
          participationId,
          marking,
        },
        user.name
      );

      const createdMarking = await prisma.marking.create({
        data: ChallengeMapper.mapCreateMarkingInput(participationId, marking),
      });
      // Clear markingsLoader cache
      loaders.markingsLoader.clear(participationId);

      return createdMarking;
    },
    editMarking: async (
      _,
      { id, marking },
      { prisma, s3Client, loaders, user }
    ) => {
      if (!user) throw new AuthenticationError();
      // Check validity
      await ChallengeValidator.validateMarkingUpdateInput(
        id,
        marking,
        user.name
      );
      const oldMarking = await prisma.marking.findUnique({
        where: { id },
      });

      const editMarking = await prisma.marking.update({
        where: { id },
        data: ChallengeMapper.mapEditMarkingInput(marking),
      });
      // If oldMarking data has photoUrl, new photo url is not undefined (== no modifications) and is not the same as old -> delete old from s3
      if (
        oldMarking?.photo_url &&
        marking.photoUrl !== undefined &&
        oldMarking.photo_url !== marking.photoUrl
      ) {
        try {
          await s3Client.deleteImage(oldMarking.photo_url);
        } catch (error) {
          console.log(
            `Couldn't delete marking image: ${oldMarking.photo_url} error: ${error.message}`
          );
        }
      }
      // Clear markingsLoader cache
      loaders.markingsLoader.clear(editMarking.participation_id);
      return editMarking;
    },
    deleteMarking: async (_, { id }, { prisma, s3Client, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateDeleteMarking(id, user.name);

      const marking = await prisma.marking.findUnique({
        where: { id },
      });
      // Clear markingsLoader cache
      await loaderResetors.clearMarkingsCache(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedMarkings = await prisma.$executeRaw(
        `DELETE FROM "Marking" WHERE id='${id}';`
      );
      if (deletedMarkings > 0) {
        // If more than 0 rows are affected by above query -> marking deleted -> delete related photo from s3
        if (marking?.photo_url) {
          // If marking has photoUrl, try to delete it from aws
          try {
            await s3Client.deleteImage(marking.photo_url);
          } catch (error) {
            console.log(
              `Couldn't delete marking ${marking.id} image: ${marking.photo_url} error: ${error.message}`
            );
          }
        }
        return true;
      }
      return false;
    },
    transferUserMarkings: async (
      _,
      { challengeId },
      { prisma, loaders, user }
    ) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateTransferUserMarking(
        user.name,
        challengeId
      );

      const participationToUpdate = await prisma.challengeParticipation.findFirst(
        {
          where: {
            Challenge: { name: "NO_PARTICIPATION_MARKINGS_HOLDER" },
            user_name: user.name,
          },
        }
      );
      if (!participationToUpdate)
        throw new Error(
          `transferUserMarkings NO_PARTICIPATION_MARKINGS_HOLDER-participation with user: ${user.name}wasn't found`
        );
      // Update participation to point to new challenge
      await prisma.challengeParticipation.update({
        where: { id: participationToUpdate.id },
        data: { challenge_id: challengeId, user_name: user.name },
      });

      await loaderResetors.clearParticipationsCache(
        participationToUpdate.id,
        loaders
      );
      return true; // Backup
    },
    createChallenge: async (_, { challenge }, { prisma, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateCreateChallengeArgs(challenge);
      const createChallenge = await prisma.challenge.create({
        data: ChallengeMapper.mapCreateChallengeInput(challenge, user.name),
      });
      await loaderResetors.clearParticipationsCacheByChallenge(
        createChallenge.id,
        loaders
      );
      return createChallenge;
    },
    updateChallenge: async (_, { id, args }, { prisma, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateUpdateChallenge(args, id, user.name);
      const updatedChallenge = await prisma.challenge.update({
        where: { id },
        data: ChallengeMapper.mapEditChallengeInput(args),
      });
      // Clear challengeLoader cache by challenge id
      loaders.challengeLoader.clear(id);
      return updatedChallenge;
    },
    deleteChallenge: async (_, { id }, { prisma, s3Client, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateDeleteChallengeArgs(id, user.name);
      // Get markings to delete from s3 here, later this data won't be available
      const challengeMarkings = await prisma.marking.findMany({
        where: {
          ChallengeParticipation: {
            challenge_id: id,
          },
        },
      });
      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByChallenge(id, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedChallenges = await prisma.$executeRaw(
        `DELETE FROM "Challenge" WHERE id='${id}';`
      );
      if (deletedChallenges > 0) {
        // If more than 0 rows are affected by above query == challenge deleted -> delete all related marking-images from s3

        try {
          await Promise.all(
            challengeMarkings.map((it: Marking) => {
              if (it.photo_url) {
                return s3Client.deleteImage(it.photo_url);
              }
              return false;
            })
          );
        } catch (error) {
          console.log(
            `Something went wrong when deleting challenge: ${id} marking images from s3: ${error.message}`
          );
        }
        return true; // If more than 0 rows are affected by above query
      }
      return false;
    },
    createParticipation: async (_, { input }, { prisma, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateCreateParticipation(input);

      const participation = await prisma.challengeParticipation.create({
        data: ChallengeMapper.mapCreateParticipationInput(input, user.name),
      });
      // Clear participationsLoader cache by created participation id
      await loaderResetors.clearParticipationsCache(participation.id, loaders);
      return participation;
    },
    updateParticipation: async (_, { input }, { prisma, loaders, user }) => {
      if (!user) throw new AuthenticationError();
      const id = "terve";
      await ChallengeValidator.validateUpdateChallenge(input, id, user.name);
      const updatedParticipation = await prisma.challengeParticipation.update({
        where: { id },
        data: ChallengeMapper.mapUpdateParticipationInput(input),
      });
      // Clear challengeLoader cache by challenge id
      await loaderResetors.clearParticipationsCache(
        updatedParticipation.id,
        loaders
      );
      return updatedParticipation;
    },
    deleteParticipation: async (
      _,
      { id },
      { prisma, s3Client, loaders, user }
    ) => {
      if (!user) throw new AuthenticationError();
      await ChallengeValidator.validateDeleteParticipation(id, user.name);
      // Get markings to delete from s3 here, later this data won't be available
      const participationMarkings = await prisma.marking.findMany({
        where: {
          id,
        },
      });

      // Clear partipationsLoader cache
      await loaderResetors.clearParticipationsCacheByUser(user.name, loaders);
      // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
      const deletedParticipations = await prisma.$executeRaw(
        `DELETE FROM "ChallengeParticipation" WHERE id='${id}';`
      );
      if (deletedParticipations > 0) {
        // If more than 0 rows are affected by above query == participation deleted -> delete all related marking-images from s3
        try {
          await Promise.all(
            participationMarkings.map((it: Marking) => {
              if (it.photo_url) {
                return s3Client.deleteImage(it.photo_url);
              }
              return false;
            })
          );
        } catch (error) {
          console.log(
            `Something went wrong when deleting participation: ${id}:${user.name} marking images from s3: ${error.message}`
          );
        }
        return true;
      }

      return false;
    },
  },
};
