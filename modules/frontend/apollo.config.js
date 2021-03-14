const { NODE_ENV } = process.env;

module.exports = {
  client: {
    service: {
      url:
        NODE_ENV === "production"
          ? "/graphql"
          : "http://localhost:4000/graphql",
      //   localSchemaFile: "./src/apollo/schema.json",
      includes: ["./src"],
      excludes: ["node_modules/*"],
    },
  },
};
