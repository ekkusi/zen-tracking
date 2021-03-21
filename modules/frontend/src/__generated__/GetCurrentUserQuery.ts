/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserQuery
// ====================================================

export interface GetCurrentUserQuery_getCurrentUser {
  __typename: "User";
  name: string;
  isPrivate: boolean;
}

export interface GetCurrentUserQuery {
  getCurrentUser: GetCurrentUserQuery_getCurrentUser;
}
