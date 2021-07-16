/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_user_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface Login_login_user_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface Login_login_user_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: Login_login_user_activeParticipation_challenge;
  markings: Login_login_user_activeParticipation_markings[];
}

export interface Login_login_user {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  finishedAndCheckedChallenges: string[];
  activeParticipation: Login_login_user_activeParticipation | null;
}

export interface Login_login {
  __typename: "LoginResult";
  accessToken: string;
  user: Login_login_user;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  name: string;
  password: string;
  activeParticipationChallengeId?: string | null;
}
