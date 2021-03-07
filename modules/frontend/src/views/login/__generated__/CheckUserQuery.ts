/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserCheckStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: CheckUserQuery
// ====================================================

export interface CheckUserQuery_checkUser_user {
  __typename: "User";
  name: string;
  isPrivate: boolean;
}

export interface CheckUserQuery_checkUser {
  __typename: "UserCheckResult";
  status: UserCheckStatus;
  user: CheckUserQuery_checkUser_user | null;
}

export interface CheckUserQuery {
  checkUser: CheckUserQuery_checkUser;
}

export interface CheckUserQueryVariables {
  name: string;
  password: string;
}
