import { AuthenticationError as ApolloAuthenticationError } from "apollo-server-express";

export default class AuthenticationError extends ApolloAuthenticationError {
  constructor(m?: string) {
    super(m || "Sinun pitää olla autentikoitunut tätä operaatiota varten");

    // Set the prototype explicitly. Because of some TS issue.
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
