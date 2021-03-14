import { PrismaClient } from "@prisma/client";
import { hash } from "./auth";

const client = new PrismaClient();

// Converts user current password to hashed version
// NOTE: Don't run if password is already hashed, auth will not work anymore
export const hashUserPassword = async (name: string): Promise<void> => {
  const user = await client.user.findUnique({ where: { name } });
  if (user) {
    const hashedPassword = await hash(user.password);
    const update = await client.user.update({
      where: { name },
      data: { password: hashedPassword },
    });
  } else {
    throw new Error(`User: ${name} not found, can't hash password`);
  }
};

// Hash all users passwords
const hashAllUsers = async () => {
  try {
    const users = await client.user.findMany();
    await Promise.all(users.map((it) => hashUserPassword(it.name)));
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

// hashAllUsers().then(() => {
//   console.log("Valmis");
//   process.exit();
// });
