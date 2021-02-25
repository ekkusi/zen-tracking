import textract from "textract";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

console.log("Starting to extract and create quotes:");

// console.log("Wiping current data from Quote-table...");
// prismaClient.quote
//   .deleteMany()
//   .then(() => {
//     console.log("Quote-table wiped succesfully!");

const pathToPhotos = path.join(
  __dirname,
  "../../../frontend/public/photos/quotes"
);

const photosDir = fs.readdirSync(pathToPhotos);

let extractedCount = 0; // To calculate extracted images

photosDir.forEach((it) => {
  const fileName = it;
  const filePath = `${pathToPhotos}/${fileName}`;

  console.log("Extracting file:", filePath);
  textract.fromFileWithPath(
    filePath,
    { tesseract: { lang: "fin" } },
    (err, quote) => {
      extractedCount += 1; // Add extracted count to see when all are extracted to kill process
      // If errors returned from textract
      if (err) {
        console.log(`Error extracting ${fileName}:`, err);
      }
      // If errors returned from textract
      else if (quote.length <= 1) {
        console.log(
          "Empty text returned from: ",
          fileName,
          ", not adding to db"
        );
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
            const successMsg = `Added quote ${quote} to database succesfully!`;
            console.log(successMsg);
            if (extractedCount === photosDir.length) process.exit(); // Kill process if all photos are extracted
          })
          .catch((dbErr) => {
            const errMsg = `Something wen't wrong when adding quote ${quote} to db:${dbErr.message}`;
            console.error(errMsg);
          })
          .finally(() => {
            // Kill process if all photos are extracted
            if (extractedCount === photosDir.length) {
              console.log("All photos have been processed!");
              process.exit();
            }
          });
      }
      console.log(`Extracted ${extractedCount}/${photosDir.length} photos`);
    }
  );
});
