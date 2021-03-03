/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserCheckStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: checkUser
// ====================================================

export interface checkUser_checkUser_user {
  __typename: "User";
  name: string;
  isPrivate: boolean;
}

export interface checkUser_checkUser {
  __typename: "UserCheckResult";
  status: UserCheckStatus;
  user: checkUser_checkUser_user | null;
}

export interface checkUser {
  checkUser: checkUser_checkUser;
}

export interface checkUserVariables {
  name: string;
  password: string;
}
