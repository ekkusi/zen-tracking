import { gql } from "@apollo/client";
import { userDataFragment } from "fragments";

export const CHECK_USER = gql`
  query CheckUserQuery($name: ID!, $password: String!) {
    checkUser(name: $name, password: $password) {
      status
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;
