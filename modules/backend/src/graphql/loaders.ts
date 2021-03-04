import { DataLoaders } from "@/types/customContext";
import { MarkingsLoadResult } from "@/types/dataLoader";
import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { ChallengeMapper } from "./challenge/ChallengeMapper";
import { UserMapper } from "./user/UserMapper";

import prisma from "./client";

const removeReadonlyFromKeys = (keys: readonly string[]): string[] => {
  return keys.map((it) => it);
};

export const loaderResetors = {
  // participationsLoader cache clearer when you don't have access to participation user and challenge id
  clearParticipationsCache: async (
    participationId: string,
    loaders: DataLoaders
  ) => {
    const participation = await prisma.challengeParticipation.findUnique({
      where: { id: participationId },
    });
    if (participation) {
      loaders.challengeParticipationsLoader.clear(participation.challenge_id);
      loaders.userParticipationsLoader.clear(participation.user_name);
    } else
      throw new Error(
        `Couldn't clear participationsLoaders, no participation found with id ${participationId}`
      );
  },
  // participationsLoader cache clearer when only access to user name
  clearParticipationsCacheByUser: async (
    name: string,
    loaders: DataLoaders
  ) => {
    const participations = await prisma.challengeParticipation.findMany({
      where: { user_name: name },
    });
    participations.forEach((it) => {
      loaders.challengeParticipationsLoader.clear(it.challenge_id);
      loaders.userParticipationsLoader.clear(it.user_name);
    });
  },
  // participationsLoader cache clearer when only access to challenge id
  clearParticipationsCacheByChallenge: async (
    challengeId: string,
    loaders: DataLoaders
  ) => {
    const participations = await prisma.challengeParticipation.findMany({
      where: { challenge_id: challengeId },
    });
    participations.forEach((it) => {
      console.log(
        `Clearing caches for participation: ${it.id} user: ${it.user_name}`
      );
      loaders.challengeParticipationsLoader.clear(it.challenge_id);
      loaders.userParticipationsLoader.clear(it.user_name);
    });
  },
  // markingsLoader cache clearer when you don't have access to marking participationId
  clearMarkingsCache: async (markingId: string, loaders: DataLoaders) => {
    const marking = await prisma.marking.findUnique({
      where: { id: markingId },
    });
    if (marking) {
      loaders.markingsLoader.clear(marking.participation_id);
    } else
      throw new Error(
        `Couldn't clear markingsLoader, no marking found with id ${markingId}`
      );
  },
};

// Data loaders to cache and bundle queries to prisma to prevent querying too many times
const dataLoaders: DataLoaders = {
  markingsLoader: new DataLoader(async (keys) => {
    console.log(`markingsLoaders running... participation ids: ${keys}`);
    // Switch key types, resulting keyStrings should always be same as parameter keys
    const convertedKeys = removeReadonlyFromKeys(keys);

    const markings = await prisma.marking.findMany({
      where: { participation_id: { in: convertedKeys } },
    });

    console.log(`markingsLoaders loaded markings: ${JSON.stringify(markings)}`);

    // Return array size must match keys amount so we map array of arrays by keys
    return Promise.all(
      convertedKeys.map((key) => {
        return markings.filter((it) => it.participation_id === key);
      })
    );
  }),
  challengeLoader: new DataLoader(async (keys) => {
    console.log(`challengeLoader running... challenge ids: ${keys}`);
    const convertedKeys = removeReadonlyFromKeys(keys);
    const challenges = await prisma.challenge.findMany({
      where: { id: { in: convertedKeys } },
    });
    console.log(
      `challengeLoader loaded challenges: ${JSON.stringify(challenges)}`
    );
    return challenges;
  }),
  userLoader: new DataLoader(async (keys) => {
    console.log(`userLoader running... user names: ${keys}`);
    const convertedKeys = removeReadonlyFromKeys(keys);
    const users = await prisma.user.findMany({
      where: { name: { in: convertedKeys } },
    });
    console.log(`userLoader loaded users: ${JSON.stringify(users)}`);
    return users;
  }),
  challengeParticipationsLoader: new DataLoader(async (keys) => {
    console.log(`participationsLoader running... challenge ids: ${keys}`);
    // Switch key types, resulting keyStrings should always be same as parameter keys
    const convertedKeys = removeReadonlyFromKeys(keys);

    const participations = await prisma.challengeParticipation.findMany({
      where: { challenge_id: { in: convertedKeys } },
    });

    console.log(
      `challengeParticipationsLoader loaded participations: ${JSON.stringify(
        participations
      )}`
    );

    // Return array size must match keys amount so we map array of arrays by keys
    return Promise.all(
      convertedKeys.map((key) => {
        return participations.filter((it) => it.challenge_id === key);
      })
    );
  }),
  userParticipationsLoader: new DataLoader(async (keys) => {
    console.log(`participationsLoader running... challenge ids: ${keys}`);
    // Switch key types, resulting keyStrings should always be same as parameter keys
    const convertedKeys = removeReadonlyFromKeys(keys);

    const participations = await prisma.challengeParticipation.findMany({
      where: { user_name: { in: convertedKeys } },
    });

    console.log(
      `userParticipationsLoader loaded participations: ${JSON.stringify(
        participations
      )}`
    );

    // Return array size must match keys amount so we map array of arrays by keys
    return Promise.all(
      convertedKeys.map((key) => {
        return participations.filter((it) => it.user_name === key);
      })
    );
  }),
};

export default dataLoaders;
