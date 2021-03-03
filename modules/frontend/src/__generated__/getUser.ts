/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_getUser {
  __typename: "User";
  name: string;
  isPrivate: boolean;
}

export interface getUser {
  getUser: getUser_getUser;
}

export interface getUserVariables {
  name: string;
}
