import { gql } from "@apollo/client";
import {
  User,
  UserCheckResult,
} from "@ekeukko/zen-tracking-backend/lib/types/user";

export const CHECK_USER = gql`
  query checkUser($name: ID!, $password: String!) {
    checkUser(name: $name, password: $password)
  }
`;

export type CheckUserQueryResult = {
  checkUser: UserCheckResult;
};

export const GET_USER = gql`
  query getUser($name: ID!) {
    getUser(name: $name) {
      name
      isPrivate
      markings {
        date
        tags
        comment
      }
    }
  }
`;

export type GetUserQueryResult = {
  getUser: User;
};
