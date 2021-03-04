export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  getUser: User;
  getUsers?: Maybe<Array<User>>;
  checkUser: UserCheckResult;
  getChallenge?: Maybe<Challenge>;
  getChallenges: Array<Challenge>;
  getParticipations: Array<ChallengeParticipation>;
  getMarkings: Array<Marking>;
};


export type QueryGetUserArgs = {
  name: Scalars['ID'];
};


export type QueryCheckUserArgs = {
  name: Scalars['ID'];
  password: Scalars['String'];
};


export type QueryGetChallengeArgs = {
  id: Scalars['ID'];
};


export type QueryGetParticipationsArgs = {
  challengeId: Scalars['ID'];
};


export type QueryGetMarkingsArgs = {
  participationId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addUser: User;
  deleteUser: Scalars['Boolean'];
  createChallenge: Challenge;
  updateChallenge: Challenge;
  deleteChallenge: Scalars['Boolean'];
  createParticipation: ChallengeParticipation;
  deleteParticipation: Scalars['Boolean'];
  addMarking: Marking;
  editMarking: Marking;
  deleteMarking: Scalars['Boolean'];
};


export type MutationAddUserArgs = {
  name: Scalars['ID'];
  password: Scalars['String'];
  isPrivate?: Maybe<Scalars['Boolean']>;
};


export type MutationDeleteUserArgs = {
  name: Scalars['ID'];
};


export type MutationCreateChallengeArgs = {
  challenge: CreateChallengeInput;
};


export type MutationUpdateChallengeArgs = {
  id: Scalars['ID'];
  args: UpdateChallengeInput;
};


export type MutationDeleteChallengeArgs = {
  id: Scalars['ID'];
};


export type MutationCreateParticipationArgs = {
  challengeId: Scalars['ID'];
  userName: Scalars['ID'];
};


export type MutationDeleteParticipationArgs = {
  id: Scalars['ID'];
};


export type MutationAddMarkingArgs = {
  participationId: Scalars['ID'];
  marking?: Maybe<MarkingInput>;
};


export type MutationEditMarkingArgs = {
  id: Scalars['ID'];
  marking: MarkingInput;
};


export type MutationDeleteMarkingArgs = {
  id: Scalars['ID'];
};


export enum UserCheckStatus {
  UserAndPasswordFound = 'USER_AND_PASSWORD_FOUND',
  UserNotFoundButCreated = 'USER_NOT_FOUND_BUT_CREATED',
  InvalidPassword = 'INVALID_PASSWORD'
}

export type User = {
  __typename?: 'User';
  name: Scalars['ID'];
  isPrivate: Scalars['Boolean'];
  participations: Array<ChallengeParticipation>;
};

export type UserCheckResult = {
  __typename?: 'UserCheckResult';
  user?: Maybe<User>;
  status: UserCheckStatus;
};

export enum ChallengeStatus {
  Suggestion = 'SUGGESTION',
  Active = 'ACTIVE',
  Closed = 'CLOSED'
}

export type Challenge = {
  __typename?: 'Challenge';
  id: Scalars['ID'];
  name: Scalars['String'];
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  status: ChallengeStatus;
  creator: User;
  participations: Array<ChallengeParticipation>;
};

export type ChallengeParticipation = {
  __typename?: 'ChallengeParticipation';
  id: Scalars['ID'];
  challenge: Challenge;
  user: User;
  markings: Array<Marking>;
};

export type CreateChallengeInput = {
  name: Scalars['String'];
  status: ChallengeStatus;
  description: Scalars['String'];
  creatorName: Scalars['ID'];
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
};

export type UpdateChallengeInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  status?: Maybe<ChallengeStatus>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
};

export type Marking = {
  __typename?: 'Marking';
  id: Scalars['ID'];
  date: Scalars['Date'];
  comment?: Maybe<Scalars['String']>;
};

export type MarkingInput = {
  comment?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['Date']>;
};
