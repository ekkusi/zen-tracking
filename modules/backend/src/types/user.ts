export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
};

export type Query = {
  __typename?: "Query";
  getUser: User;
  getUsers?: Maybe<Array<User>>;
  checkUser: UserCheckResult;
};

export type QueryGetUserArgs = {
  name: Scalars["ID"];
};

export type QueryCheckUserArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
};

export type User = {
  __typename?: "User";
  name: Scalars["ID"];
  isPrivate: Scalars["Boolean"];
  markings: Array<Marking>;
};

export type UserCheckResult = {
  __typename?: "UserCheckResult";
  user?: Maybe<User>;
  status: UserCheckStatus;
};

export type Mutation = {
  __typename?: "Mutation";
  addUser: User;
  addMarking: Marking;
  editMarking: Marking;
  deleteMarking: Scalars["Boolean"];
};

export type MutationAddUserArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
  isPrivate?: Maybe<Scalars["Boolean"]>;
};

export type MutationAddMarkingArgs = {
  userName: Scalars["ID"];
  marking?: Maybe<MarkingInput>;
};

export type MutationEditMarkingArgs = {
  id: Scalars["ID"];
  marking: MarkingInput;
};

export type MutationDeleteMarkingArgs = {
  id: Scalars["ID"];
};

export type MarkingInput = {
  comment?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
};

export type Marking = {
  __typename?: "Marking";
  id: Scalars["ID"];
  date: Scalars["Date"];
  comment?: Maybe<Scalars["String"]>;
};

export enum UserCheckStatus {
  UserAndPasswordFound = "USER_AND_PASSWORD_FOUND",
  UserNotFoundButCreated = "USER_NOT_FOUND_BUT_CREATED",
  InvalidPassword = "INVALID_PASSWORD",
}
