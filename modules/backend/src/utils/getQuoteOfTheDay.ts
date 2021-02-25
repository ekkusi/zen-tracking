import { PrismaClient, Quote } from "@prisma/client";

const prismaClient = new PrismaClient();

const getQuoteOfTheDay = async (): Promise<Quote> => {
  const quotes = await prismaClient.quote.findMany();
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export default getQuoteOfTheDay;
