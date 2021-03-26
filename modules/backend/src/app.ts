import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors, { CorsOptions } from "cors";
import graphqlApi from "./graphql/server";
import quoteOfTheDay from "./utils/getQuoteOfTheDay";

import s3Client from "./utils/awsS3Client";

import config from "./config.json";
import AuthenticationError from "./utils/errors/AuthenticationError";
import { AuthenticatedUser } from "./types/customContext";
import {
  createAccessToken,
  createRefreshToken,
  createRefreshTokenCookie,
} from "./utils/auth";

dotEnv.config();
const app = express();
const port = process.env.PORT || 4000; // default port to listen, set to 443 to test without port in url

// This has to be before setting other cors, because there is own cors options in graphql api
graphqlApi(app);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (origin === undefined || config.ALLOWED_ORIGINS.includes(origin)) {
      console.log(`Cors allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`Cors not allowed for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(fileUpload());

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

  try {
    const result = await s3Client.uploadImage(firstPhoto);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.post("/delete-image", async (req, res) => {
  if (req.body && req.body.fileName) {
    try {
      await s3Client.deleteImage(req.body.fileName);
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  }
  return res.status(500).send();
});

app.post("/refresh-token", (req, res) => {
  try {
    const { jubbiduu } = req.cookies;
    if (!jubbiduu) {
      throw new AuthenticationError("Refresh token keksiä ei löytynyt");
    }
    const decoded = jwt.verify(
      jubbiduu,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY!
    ) as any;
    if (typeof decoded !== "object" || !decoded.user)
      throw new AuthenticationError(
        "Refresh token keksi ei palauttanut oikeita tietoja"
      );
    const { user }: { user: AuthenticatedUser } = decoded;
    createRefreshTokenCookie(createRefreshToken(user), res);

    return res.status(200).send({
      accessToken: createAccessToken(user),
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
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
