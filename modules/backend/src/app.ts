import express from "express";
import path from "path";
import graphqlApi from "./graphql/server";

const app = express();
const port = process.env.PORT || 5000; // default port to listen, set to 443 to test without port in url

graphqlApi(app);

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
