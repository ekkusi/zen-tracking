import { gql } from "@apollo/client";

export const markingDataFragment = gql`
  fragment MarkingData on Marking {
    id
    date
    comment
    photoUrl
  }
`;

export const userDataFragment = gql`
  fragment UserData on User {
    name
    isPrivate
  }
`;

export const challengeDataFragment = gql`
  fragment ChallengeData on Challenge {
    id
    name
    status
    startDate
    endDate
    description
    creator {
      name
    }
  }
`;
