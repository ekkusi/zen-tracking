import prisma from "../graphql/client";
import mockData from "./mockData.json";
import { hash } from "../utils/auth";

console.log("Starting to init mock_data.json to database");

const initMockData = async () => {
  // Create mock users
  const userPromises = Promise.all(
    mockData.users.map(async (user) => {
      const { password, ...userData } = user;
      return prisma.user.create({
        data: {
          ...userData,
          password: await hash(password),
        },
      });
    })
  );
  await userPromises;
  // Create mock challenges
  const challengePromises = Promise.all(
    mockData.challenges.map(async (challenge) => {
      const { participations, ...challengeData } = challenge;
      const createdChallenge = await prisma.challenge.create({
        data: {
          ...challengeData,
        },
      });
      console.log(`Created challenge: ${JSON.stringify(createdChallenge)}`);
      if (participations) {
        // Create participations of challenge
        await Promise.all(
          participations.map(async (participation: any) => {
            const { markings, ...participationData } = participation;
            const createParticipation = await prisma.challengeParticipation.create(
              {
                data: {
                  challenge_id: createdChallenge.id,
                  ...participationData,
                },
              }
            );
            console.log(
              `Created participation: ${JSON.stringify(createParticipation)}`
            );

            // Create markings of participation
            if (markings) {
              await Promise.all(
                markings.map(async (marking: any) => {
                  return prisma.marking.create({
                    data: {
                      participation_id: createParticipation.id,
                      ...marking,
                    },
                  });
                })
              );
            }
          })
        );
      }
      return createdChallenge;
    })
  );
  await challengePromises;
};

initMockData()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    console.log("Initialization over");
    process.exit();
  });
