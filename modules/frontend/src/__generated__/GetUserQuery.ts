/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserQuery
// ====================================================

export interface GetUserQuery_getUser {
  __typename: "User";
  name: string;
  isPrivate: boolean;
}

export interface GetUserQuery {
  getUser: GetUserQuery_getUser;
}

export interface GetUserQueryVariables {
  name: string;
}
