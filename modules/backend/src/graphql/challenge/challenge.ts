import { readFileSync } from "fs";
import path from "path";

import { Resolvers } from "../../types/challenge-resolvers";
import { ChallengeMapper } from "./ChallengeMapper";

// Construct a schema, using GraphQL schema language
export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

export const resolvers: Resolvers = {
  ChallengeParticipation: {
    markings: async ({ user }, { loaders: { markingLoader } }: any) => {
      console.log(
        `ChallengeParticipation.markings user: ${JSON.stringify(user)}`
      );
      const markings = await markingLoader.load(user.name);
      if (markings[user.name]) {
        return markings[user.name];
      }
      return [];
    },
  },
  Mutation: {
    addMarking: async (_, { userName, marking }, { prisma }) => {
      console.log("addMarking args:", JSON.stringify(marking));

      const createdMarking = await prisma.marking.create({
        data: ChallengeMapper.mapCreateMarkingInput(userName, marking || {}),
      });
      return ChallengeMapper.mapMarking(createdMarking);
    },
    editMarking: async (_, { id, marking }, { prisma }) => {
      console.log("editMarking args:", JSON.stringify(marking));
      try {
        const editMarking = await prisma.marking.update({
          where: { id },
          data: ChallengeMapper.mapEditMarkingInput(marking),
        });
        return ChallengeMapper.mapMarking(editMarking);
      } catch (error) {
        throw new Error(`editMarking error: marking with id ${id} not found`);
      }
    },
    deleteMarking: async (_, { id }, { prisma }) => {
      try {
        await prisma.marking.delete({ where: { id } });
        return true;
      } catch (error) {
        throw new Error(`deleteMarking error: marking with id ${id} not found`);
      }
    },
  },
};
