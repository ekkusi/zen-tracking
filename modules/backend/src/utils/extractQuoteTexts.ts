import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const azureOCRUrl =
  "https://northeurope.api.cognitive.microsoft.com/vision/v3.2/ocr?language=fi";
const prismaClient = new PrismaClient();
const pathToPhotos = path.join(
  __dirname,
  "../../../frontend/public/photos/quotes"
);
const photosDir = fs.readdirSync(pathToPhotos);
let extractedCount = 0; // To calculate extracted images
let totalQuoteCount = photosDir.length; // Add to separate variable, so we can reduce, if no quote is found in photo
let rateLimitInterval: NodeJS.Timeout;

const setRateLimitInterval = () => {
  rateLimitInterval = setInterval(() => {
    console.log("Waiting for Microsoft API rate limits to clear...");
  }, 5000);
};

// Parse text string from computer vision obj
const parseText = (textObj: any): string => {
  if (textObj.regions?.length === 0) return "";
  const { lines } = textObj.regions[0];
  let quote = "";
  lines.forEach((line: any, lineIndex: any) => {
    line.words.forEach((word: any) => {
      // If isn't first word, and the word starts with capital -> start new sentence, meaning add . and space
      if (lineIndex !== 0 && word.text[0] === word.text[0].toUpperCase()) {
        // Remove space added from last word, will be replaced after dot
        quote = quote.slice(0, quote.length - 1);
        quote += ". ";
      }
      quote += `${word.text} `;
    });
  });
  // Add . to end last sentence
  if (quote.length !== 0) {
    // Remove space added from last word, will be replaced after dot
    quote = quote.slice(0, quote.length - 1);
    quote += ".";
  }
  return quote;
};

const fetchAndExtract = (imageBuffer: Buffer, fileName: string) => {
  const refetchAfterTimeout = (waitTimeSeconds: number) => {
    if (!rateLimitInterval) {
      setRateLimitInterval();
    }
    setTimeout(() => {
      console.log(`Trying to extract file: ${fileName} again`);
      fetchAndExtract(imageBuffer, fileName);
    }, waitTimeSeconds * 1000);
  };
  fetch(azureOCRUrl, {
    method: "POST",
    body: imageBuffer,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key":
        process.env.MICROSOFT_COMPUTER_VISION_API_KEY || "",
    },
  })
    .then((result) => {
      result.json().then((jsonObj) => {
        if (jsonObj.error) {
          let secondsToWait = 60;
          // If error is rate limit exceeded, calculate new wait time
          if (jsonObj.error.code === "429") {
            // Example string of rate limit error: Requests to the OCR Operation under Computer Vision API (v3.2) have exceeded rate limit of your current ComputerVision F0 pricing tier. Please retry after 55 seconds. To increase your rate limit switch to a paid tier.
            // This splits the "55" from "55 seconds" part, to calculate, when to try fetch again.
            const splittedMessage: string[] = jsonObj.error.message.split(" ");

            splittedMessage.forEach((msgPart: string, i: number) => {
              if (msgPart === "seconds.") {
                secondsToWait = parseInt(splittedMessage[i - 1], 10) + 1;
              }
            });
            console.log(
              `Micrsoft API rate limit exceeded. Waiting for ${secondsToWait} seconds and trying again`
            );
            refetchAfterTimeout(secondsToWait);
            return;
          }
          console.log(
            `Error with computer vision api fetch: ${jsonObj.error.message}`
          );
          console.log("Trying to fetch again in 1 minute");
          refetchAfterTimeout(secondsToWait);
          return;
        }
        if (jsonObj.statusCode === 429) {
          console.log(
            "Micrsoft API rate limit exceeded. Trying again in 1 minute"
          );
          refetchAfterTimeout(61);
          return;
        }

        const quote = parseText(jsonObj);
        // If errors returned from textract
        if (quote.length <= 1) {
          console.log(
            "Empty text returned from: ",
            fileName,
            ", not adding to db and reducing total quote count"
          );
          totalQuoteCount -= 1;
        }
        // Else create quote to db
        else {
          console.log(
            fileName,
            "quote:",
            quote,
            ", quote length:",
            quote.length,
            ", adding to database..."
          );
          prismaClient.quote
            .create({
              data: { quote },
            })
            .then(() => {
              extractedCount += 1; // Add extracted count to see when all are extracted to kill process
              const successMsg = `Added quote ${quote} to database succesfully!`;
              console.log(successMsg);
            })
            .catch((dbErr) => {
              const errMsg = `Something wen't wrong when adding quote ${quote} to db:${dbErr.message}`;
              console.error(errMsg);
            })
            .finally(() => {
              console.log(
                `Extracted ${extractedCount}/${totalQuoteCount} photos`
              );
              // Kill process if all photos are extracted
              if (extractedCount === totalQuoteCount) {
                console.log("\n\nAll photos have been processed successfully!");
                process.exit();
              }
            });
        }
      });
    })
    .catch((error) => {
      console.log(`Error with computer vision api: ${error}`);
      console.log("Probably exceeded rate limit, trying again in 1 minute");
      refetchAfterTimeout(60);
    });
};

console.log("Wiping current data from Quote-table...");

prismaClient.quote.deleteMany().then(() => {
  console.log("Quote-table wiped succesfully!");
  console.log("Starting to extract and create quotes:");
  photosDir.forEach((it) => {
    const fileName = it;
    const filePath = `${pathToPhotos}/${fileName}`;

    console.log("Extracting file:", filePath);
    fs.readFile(filePath, (err, imageBuffer) => {
      if (err) {
        console.log(`Couldn't read file: ${filePath}`);
      } else {
        fetchAndExtract(imageBuffer, fileName);
      }
    });
  });
});
