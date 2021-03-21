import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LoginMutation($name: ID!, $password: String!) {
    login(name: $name, password: $password) {
      accessToken
    }
  }
`;
