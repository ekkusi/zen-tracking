import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import aws from "aws-sdk";
import dotEnv from "dotenv";
import { v4 as generateId } from "uuid";
import graphqlApi from "./graphql/server";
import quoteOfTheDay from "./utils/getQuoteOfTheDay";

dotEnv.config();
const app = express();
app.use(fileUpload());
const port = process.env.PORT || 4000; // default port to listen, set to 443 to test without port in url
const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});
const s3 = new aws.S3();
graphqlApi(app);

app.get("/quote", async (req, res, next) => {
  try {
    const quote = await quoteOfTheDay();
    res.json({
      quote: quote.quote,
    });
    return { ...quote };
  } catch (error) {
    return next(error);
  }
});

app.post("/upload-image", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !S3_BUCKET) {
    return res.status(400).send();
  }
  const { photo } = req.files;
  const firstPhoto = Array.isArray(photo) ? photo[0] : photo;
  const fileName = `${generateId()}-${firstPhoto.name}`;
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${process.env.AWS_S3_MARKING_IMAGE_FOLDER}/${fileName}`,
    Body: firstPhoto.data,
  };

  try {
    const data = await s3.upload(s3Params).promise();
    return res.status(200).send({ url: data.Location, fileName });
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.post("/delete-image", async (req, res) => {
  if (req.body.fileName && S3_BUCKET) {
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `${process.env.AWS_S3_MARKING_IMAGE_FOLDER}/${req.body.fileName}`,
    };
    try {
      await s3.deleteObject(s3Params).promise();
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  }
  return res.status(500).send();
});

if (process.env.NODE_ENV === "production") {
  // Compute the build path and index.html path
  const buildPath = path.resolve(__dirname, "../../frontend/build");
  const indexHtml = path.join(buildPath, "index.html");

  // Setup build path as a static assets path
  app.use(express.static(buildPath));
  // Serve index.html on unmatched routes
  app.get("*", (req, res) => res.sendFile(indexHtml));
}

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

// So that nodemon doesnt start two servers
// process.on("uncaughtException", () => {
//   server.close();
// });
// process.on("exit", () => {
//   server.close();
// });
// process.on("SIGTERM", () => {
//   server.close();
// });
