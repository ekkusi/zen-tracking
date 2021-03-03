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
  /** Date custom scalar type */
  Date: any;
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  checkUser: UserCheckResult;
  getChallenge: Challenge;
  getChallenges: Array<Challenge>;
  getUser: User;
  getUsers?: Maybe<Array<User>>;
};

export type QueryCheckUserArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
};

export type QueryGetChallengeArgs = {
  id: Scalars["ID"];
};

export type QueryGetUserArgs = {
  name: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  addMarking: Marking;
  addUser: User;
  createChallenge: Challenge;
  createParticipation: ChallengeParticipation;
  deleteChallenge: Scalars["Boolean"];
  deleteMarking: Scalars["Boolean"];
  deleteParticipation: Scalars["Boolean"];
  editMarking: Marking;
  updateChallenge: Challenge;
};

export type MutationAddMarkingArgs = {
  userName: Scalars["ID"];
  participationId: Scalars["ID"];
  marking?: Maybe<MarkingInput>;
};

export type MutationAddUserArgs = {
  isPrivate?: Maybe<Scalars["Boolean"]>;
  name: Scalars["ID"];
  password: Scalars["String"];
};

export type MutationCreateChallengeArgs = {
  challenge: CreateChallengeInput;
};

export type MutationCreateParticipationArgs = {
  challengeId: Scalars["ID"];
  userName: Scalars["ID"];
};

export type MutationDeleteChallengeArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteMarkingArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteParticipationArgs = {
  id: Scalars["ID"];
};

export type MutationEditMarkingArgs = {
  id: Scalars["ID"];
  marking: MarkingInput;
};

export type MutationUpdateChallengeArgs = {
  args: UpdateChallengeInput;
};

export enum UserCheckStatus {
  InvalidPassword = "INVALID_PASSWORD",
  UserAndPasswordFound = "USER_AND_PASSWORD_FOUND",
  UserNotFoundButCreated = "USER_NOT_FOUND_BUT_CREATED",
}

export type User = {
  __typename?: "User";
  activeParticipation?: Maybe<ChallengeParticipation>;
  isPrivate: Scalars["Boolean"];
  name: Scalars["ID"];
  participations: Array<ChallengeParticipation>;
};

export type UserCheckResult = {
  __typename?: "UserCheckResult";
  status: UserCheckStatus;
  user?: Maybe<User>;
};

export enum ChallengeStatus {
  Suggestion = "SUGGESTION",
  Active = "ACTIVE",
  Closed = "CLOSED",
}

export type Challenge = {
  __typename?: "Challenge";
  creator: User;
  endDate?: Maybe<Scalars["Date"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  participations: Array<ChallengeParticipation>;
  startDate?: Maybe<Scalars["Date"]>;
  status: ChallengeStatus;
};

export type ChallengeParticipation = {
  __typename?: "ChallengeParticipation";
  challenge: Challenge;
  id: Scalars["ID"];
  markings: Array<Marking>;
  user: User;
};

export type CreateChallengeInput = {
  name: Scalars["String"];
  status: ChallengeStatus;
  creatorId: Scalars["ID"];
  startDate?: Maybe<Scalars["Date"]>;
  endDate?: Maybe<Scalars["Date"]>;
};

export type UpdateChallengeInput = {
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<ChallengeStatus>;
  startDate?: Maybe<Scalars["Date"]>;
  endDate?: Maybe<Scalars["Date"]>;
};

export type Marking = {
  __typename?: "Marking";
  comment?: Maybe<Scalars["String"]>;
  date: Scalars["Date"];
  id: Scalars["ID"];
};

export type MarkingInput = {
  comment?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
};
