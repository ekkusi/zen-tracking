/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PasswordInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditUser
// ====================================================

export interface EditUser_editUser_user {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
}

export interface EditUser_editUser {
  __typename: "LoginResult";
  accessToken: string;
  user: EditUser_editUser_user;
}

export interface EditUser {
  editUser: EditUser_editUser;
}

export interface EditUserVariables {
  name?: string | null;
  passwordInput?: PasswordInput | null;
  email?: string | null;
  isPrivate?: boolean | null;
}
