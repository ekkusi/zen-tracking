import { PrismaClient } from "@prisma/client";
import { addDays, format, formatISO } from "date-fns";

const prisma = new PrismaClient();

const testFunction = async () => {
  const currentDate = new Date(
    "Current date: Tue Mar 02 2021 00:00:00 GMT+0200 (Eastern European Standard Time)"
  );
  console.log(`Default current date toString(): ${currentDate.toISOString()}`);
  const currentDayString = new Date(
    format(currentDate, "yyyy-MM-dd")
  ).toISOString();
  const nextDayDate = addDays(currentDate, 1);
  const nextDayString = new Date(
    formatISO(nextDayDate, { representation: "date" })
  ).toISOString();
  console.log(`Current date: ${currentDayString}`);
  console.log(`Next date: ${nextDayString}`);
  const markingInBetween = await prisma.marking.findFirst({
    where: {
      user_name: "eke",
      date: { lte: nextDayString, gte: currentDayString },
    },
  });
  console.log(JSON.stringify(markingInBetween));
};

testFunction();
