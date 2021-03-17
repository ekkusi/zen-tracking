import { hash, compare } from "./utils/auth";

const hashPassword = async () => {
  const hashedPassword = await hash("salasana");
  console.log(hashedPassword);

  console.log(`Is salasana: ${await compare("salasana", hashedPassword)}`);
};

hashPassword();

// const createMockData = async () => {
//   const createUser = await prisma.user.create({
//     data: {
//       name: "ukko",
//       password: "salasana",
//     }
//   })
//   const createChallenge = await prisma.challenge.create({
//     data: {
//       name: "Toka haaste",
//       description: "Tokan haasteen kuvaus",
//       creator_name: createUser.name,
//       status: "SUGGESTION"
//     },
//   });
//   const createParticipation = await prisma.challengeParticipation.create({
//     data: {
//       user_name: createUser.name,
//       challenge_id: createChallenge.id,
//     }
//   });
//   const createMarking = await prisma.marking.create({
//     data: {
//       participation_id: createParticipation.id,
//       comment: "Toka merkkaus",
//     }
//   });
//   console.log("Create marking: " + JSON.stringify(createMarking));
// };

// createMockData();
