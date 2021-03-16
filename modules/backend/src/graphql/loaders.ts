import DataLoader from "dataloader";
import { Challenge, Marking, User } from "@prisma/client";
import { DataLoaders } from "../types/CustomContext";

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
    // Switch key types, resulting keyStrings should always be same as parameter keys
    const mutableKeys = removeReadonlyFromKeys(keys);

    const markings = await prisma.marking.findMany({
      where: { participation_id: { in: mutableKeys } },
    });

    // Return array size must match keys amount so we map array of arrays by keys
    return mutableKeys.map((key) => {
      return markings.filter((it) => it.participation_id === key);
    });
  }),
  challengeLoader: new DataLoader(async (keys) => {
    const mutableKeys = removeReadonlyFromKeys(keys);
    const challenges = await prisma.challenge.findMany({
      where: { id: { in: mutableKeys } },
    });

    const challengeMap: { [key: string]: Challenge } = {};
    challenges.forEach((it) => {
      challengeMap[it.id] = it;
    });

    return keys.map((key) => challengeMap[key]);
  }),
  userLoader: new DataLoader(async (keys) => {
    const mutableKeys = removeReadonlyFromKeys(keys);
    const users = await prisma.user.findMany({
      where: { name: { in: mutableKeys } },
    });

    const usersMap: { [key: string]: User } = {};
    users.forEach((it) => {
      usersMap[it.name] = it;
    });

    return keys.map((key) => usersMap[key]);
  }),
  challengeParticipationsLoader: new DataLoader(async (keys) => {
    // Switch key types, resulting keyStrings should always be same as parameter keys
    const mutableKeys = removeReadonlyFromKeys(keys);

    const participations = await prisma.challengeParticipation.findMany({
      where: { challenge_id: { in: mutableKeys } },
    });

    return mutableKeys.map((key) => {
      return participations.filter((it) => it.challenge_id === key);
    });
  }),
  userParticipationsLoader: new DataLoader(async (keys) => {
    const mutableKeys = removeReadonlyFromKeys(keys);

    const participations = await prisma.challengeParticipation.findMany({
      where: { user_name: { in: mutableKeys } },
    });

    return mutableKeys.map((key) => {
      return participations.filter((it) => it.user_name === key);
    });
  }),
};

export default dataLoaders;
