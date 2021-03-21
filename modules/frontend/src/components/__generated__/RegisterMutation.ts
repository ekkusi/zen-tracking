/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterMutation
// ====================================================

export interface RegisterMutation_register {
  __typename: "LoginResult";
  accessToken: string;
}

export interface RegisterMutation {
  register: RegisterMutation_register;
}

export interface RegisterMutationVariables {
  name: string;
  password: string;
  isPrivate: boolean;
}
