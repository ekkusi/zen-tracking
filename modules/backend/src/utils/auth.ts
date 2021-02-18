import bcrypt from "bcrypt";

const saltRounds = 10;

export const hash = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const compare = (
  password: string,
  hashString: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashString);
};
