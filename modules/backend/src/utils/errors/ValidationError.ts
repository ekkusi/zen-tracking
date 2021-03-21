export default class ValidationError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly. Because of some TS issue.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
