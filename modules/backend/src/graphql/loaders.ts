import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

export default (prisma: PrismaClient) => {
  return {
    // @ts-ignore
    markingLoader: new DataLoader(async (keys) => {
      console.log(`markingLoaders running... keys:${keys}`);
      const keyStrings: string[] = keys.map((it) =>
        typeof it === "string" ? it : ""
      );

      const markings = await prisma.marking.findMany({
        where: { user_name: { in: keyStrings } },
      });

      return Promise.all(
        keyStrings.map(async (key) => {
          const userObj = {};
          // @ts-ignore
          userObj[key] = markings.filter((it) => it.user_name === key);
          return userObj;
        })
      );
    }),
  };
};
