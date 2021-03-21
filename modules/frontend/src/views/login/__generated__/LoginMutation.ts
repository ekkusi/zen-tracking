/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login_user_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface LoginMutation_login_user_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface LoginMutation_login_user_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: LoginMutation_login_user_activeParticipation_challenge;
  markings: LoginMutation_login_user_activeParticipation_markings[];
}

export interface LoginMutation_login_user {
  __typename: "User";
  name: string;
  isPrivate: boolean;
  activeParticipation: LoginMutation_login_user_activeParticipation | null;
}

export interface LoginMutation_login {
  __typename: "LoginResult";
  accessToken: string;
  user: LoginMutation_login_user;
}

export interface LoginMutation {
  login: LoginMutation_login;
}

export interface LoginMutationVariables {
  name: string;
  password: string;
  activeParticipationChallengeId?: string | null;
}
