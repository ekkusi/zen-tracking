import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import dotEnv from "dotenv";
import graphqlApi from "./graphql/server";
import quoteOfTheDay from "./utils/getQuoteOfTheDay";

import s3Client from "./utils/awsS3Client";

dotEnv.config();
const app = express();
app.use(fileUpload());
const port = process.env.PORT || 4000; // default port to listen, set to 443 to test without port in url

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
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send();
  }
  const { photo } = req.files;
  const firstPhoto = Array.isArray(photo) ? photo[0] : photo;

  console.log(`Uploading photo, ${firstPhoto.name}`);

  try {
    const result = await s3Client.uploadImage(firstPhoto);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.post("/delete-image", async (req, res) => {
  if (req.body.fileName) {
    try {
      await s3Client.deleteImage(req.body.fileName);
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
