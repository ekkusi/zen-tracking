import { DataLoaders } from "@/types/customContext";
import { MarkingsLoadResult } from "@/types/dataLoader";
import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { ChallengeMapper } from "./challenge/ChallengeMapper";
import { UserMapper } from "./user/UserMapper";

// Data loaders to cache and bundle queries to prisma to prevent querying too many times
export default (prisma: PrismaClient): DataLoaders => {
  return {
    markingLoader: new DataLoader<string, MarkingsLoadResult, string>(
      async (keys) => {
        console.log(`markingLoaders running... keys: ${keys}`);
        // Switch key types, resulting keyStrings should always be same as parameter keys
        const keyStrings: string[] = keys.map((it) =>
          typeof it === "string" ? it : ""
        );

        console.log(`markingLoaders keyStrings after convert: ${keyStrings}`);

        const markings = await prisma.marking.findMany({
          where: { user_name: { in: keyStrings } },
        });

        const mappedMarkings = markings.map((it) =>
          ChallengeMapper.mapMarking(it)
        );

        // This needs to return a promise array
        return Promise.all(
          keyStrings.map(async (key) => {
            const userObj = {};
            // @ts-ignore
            userObj[key] = mappedMarkings.filter((it) => it.user_name === key);
            return userObj;
          })
        );
      }
    ),
  };
};
