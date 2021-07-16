import { readFileSync } from "fs";
import path from "path";
import { GraphQLScalarType } from "graphql";
import { formatIsoString } from "../../utils/dateUtils";

export const typeDef = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return formatIsoString(value); // Convert outgoing Date
  },
  parseValue(value) {
    return formatIsoString(value); // Convert incoming value to Date
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case "IntValue":
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to type expected by parseValue
      case "StringValue":
        return formatIsoString(ast.value);
      default:
        return null;
    }
  },
});

export const resolvers = {
  Date: dateScalar,
};
