import { gql } from "@apollo/client";

export const markingDataFragment = gql`
  fragment MarkingData on Marking {
    id
    date
    comment
    photoUrl
    rating
  }
`;

export const activeParticipationInfoFragment = gql`
  fragment ActiveParticipationInfo on ChallengeParticipation {
    id
    challenge {
      id
      name
      startDate
      endDate
    }
    markings {
      ...MarkingData
    }
  }
  ${markingDataFragment}
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
