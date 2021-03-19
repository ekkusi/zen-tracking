export default class AuthenticationError extends Error {
  constructor(m?: string) {
    super(m || "Sinun pitää olla autentikoitunut tätä operaatiota varten");

    // Set the prototype explicitly. Because of some TS issue.
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
