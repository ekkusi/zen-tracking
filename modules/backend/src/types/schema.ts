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
  Date: string;
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  getUser?: Maybe<User>;
  getCurrentUser: User;
  getUsers?: Maybe<Array<User>>;
  getChallenge?: Maybe<Challenge>;
  getChallenges: Array<Challenge>;
  getUserParticipations: Array<ChallengeParticipation>;
  getParticipation?: Maybe<ChallengeParticipation>;
  getMarkings: Array<Marking>;
  getUserTransferParticipation?: Maybe<ChallengeParticipation>;
};

export type QueryGetUserArgs = {
  name: Scalars["ID"];
};

export type QueryGetChallengeArgs = {
  id: Scalars["ID"];
};

export type QueryGetChallengesArgs = {
  creatorName?: Maybe<Scalars["ID"]>;
  status?: Maybe<ChallengeStatus>;
  startDate?: Maybe<DateFilter>;
  endDate?: Maybe<DateFilter>;
};

export type QueryGetParticipationArgs = {
  challengeId: Scalars["ID"];
  userName: Scalars["ID"];
};

export type QueryGetMarkingsArgs = {
  participationId: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  deleteUser: Scalars["Boolean"];
  editUser: LoginResult;
  login: LoginResult;
  register: LoginResult;
  logout: Scalars["Boolean"];
  createChallenge: Challenge;
  updateChallenge: Challenge;
  deleteChallenge: Scalars["Boolean"];
  createParticipation: ChallengeParticipation;
  deleteParticipation: Scalars["Boolean"];
  addMarking: Marking;
  editMarking: Marking;
  deleteMarking: Scalars["Boolean"];
  transferUserMarkings: Scalars["Boolean"];
};

export type MutationDeleteUserArgs = {
  name: Scalars["ID"];
};

export type MutationEditUserArgs = {
  nameInput: NameInput;
  passwordInput?: Maybe<PasswordInput>;
  email?: Maybe<Scalars["String"]>;
};

export type MutationLoginArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
};

export type MutationRegisterArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  isPrivate: Scalars["Boolean"];
};

export type MutationCreateChallengeArgs = {
  challenge: CreateChallengeInput;
};

export type MutationUpdateChallengeArgs = {
  id: Scalars["ID"];
  args: UpdateChallengeInput;
};

export type MutationDeleteChallengeArgs = {
  id: Scalars["ID"];
};

export type MutationCreateParticipationArgs = {
  challengeId: Scalars["ID"];
  isPrivate: Scalars["Boolean"];
};

export type MutationDeleteParticipationArgs = {
  challengeId: Scalars["ID"];
};

export type MutationAddMarkingArgs = {
  participationId: Scalars["ID"];
  marking: MarkingCreateInput;
};

export type MutationEditMarkingArgs = {
  id: Scalars["ID"];
  marking: MarkingUpdateInput;
};

export type MutationDeleteMarkingArgs = {
  id: Scalars["ID"];
};

export type MutationTransferUserMarkingsArgs = {
  challengeId: Scalars["ID"];
};

export type DateFilter = {
  gte?: Maybe<Scalars["String"]>;
  gt?: Maybe<Scalars["String"]>;
  lte?: Maybe<Scalars["String"]>;
  lt?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  name: Scalars["ID"];
  isPrivate: Scalars["Boolean"];
  email?: Maybe<Scalars["String"]>;
  participations: Array<ChallengeParticipation>;
  activeParticipation?: Maybe<ChallengeParticipation>;
};

export type UserActiveParticipationArgs = {
  challengeId?: Maybe<Scalars["ID"]>;
};

export type LoginResult = {
  __typename?: "LoginResult";
  accessToken: Scalars["String"];
  user: User;
};

export type NameInput = {
  currentName: Scalars["ID"];
  newName?: Maybe<Scalars["ID"]>;
};

export type PasswordInput = {
  currentPassword: Scalars["String"];
  newPassword: Scalars["String"];
};

export enum ChallengeStatus {
  Suggestion = "SUGGESTION",
  Upcoming = "UPCOMING",
  Active = "ACTIVE",
  Ended = "ENDED",
}

export type Challenge = {
  __typename?: "Challenge";
  id: Scalars["ID"];
  name: Scalars["String"];
  description: Scalars["String"];
  startDate?: Maybe<Scalars["Date"]>;
  endDate?: Maybe<Scalars["Date"]>;
  status: ChallengeStatus;
  creator: User;
  isPrivate: Scalars["Boolean"];
  participations: Array<ChallengeParticipation>;
};

export type ChallengeParticipation = {
  __typename?: "ChallengeParticipation";
  id: Scalars["ID"];
  challenge: Challenge;
  user: User;
  markings: Array<Marking>;
  isPrivate: Scalars["Boolean"];
};

export type CreateChallengeInput = {
  name: Scalars["String"];
  isPrivate: Scalars["Boolean"];
  description: Scalars["String"];
  startDate?: Maybe<Scalars["Date"]>;
  endDate?: Maybe<Scalars["Date"]>;
};

export type UpdateChallengeInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["Date"]>;
  endDate?: Maybe<Scalars["Date"]>;
  isPrivate?: Maybe<Scalars["Boolean"]>;
};

export type Marking = {
  __typename?: "Marking";
  id: Scalars["ID"];
  date: Scalars["Date"];
  rating: Scalars["Int"];
  isPrivate: Scalars["Boolean"];
  comment?: Maybe<Scalars["String"]>;
  photoUrl?: Maybe<Scalars["String"]>;
};

export type MarkingCreateInput = {
  rating: Scalars["Int"];
  isPrivate: Scalars["Boolean"];
  comment?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  photoUrl?: Maybe<Scalars["String"]>;
};

export type MarkingUpdateInput = {
  isPrivate?: Maybe<Scalars["Boolean"]>;
  rating?: Maybe<Scalars["Int"]>;
  comment?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  photoUrl?: Maybe<Scalars["String"]>;
};
