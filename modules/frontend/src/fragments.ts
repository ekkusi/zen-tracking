import { gql } from "@apollo/client";

export const markingDataFragment = gql`
  fragment MarkingData on Marking {
    id
    date
    comment
  }
`;

export const userDataFragment = gql`
  fragment UserData on User {
    name
    isPrivate
  }
  ${markingDataFragment}
`;
