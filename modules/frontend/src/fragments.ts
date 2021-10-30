import { gql } from "@apollo/client";

export const markingDataFragment = gql`
  fragment MarkingData on Marking {
    id
    date
    comment
    photoUrl
    rating
    isPrivate
  }
`;

export const participationInfoFragment = gql`
  fragment ParticipationInfo on ChallengeParticipation {
    id
    isPrivate
    startDate
    endDate
    challenge {
      id
      name
      status
    }
  }
`;

export const activeParticipationInfoFragment = gql`
  fragment ActiveParticipationInfo on ChallengeParticipation {
    ...ParticipationInfo
    markings {
      ...MarkingData
    }
  }
  ${markingDataFragment}
  ${participationInfoFragment}
`;

export const userDataFragment = gql`
  fragment UserData on User {
    name
    email
    isPrivate
    finishedAndCheckedParticipations
  }
`;

export const challengeDataFragment = gql`
  fragment ChallengeData on Challenge {
    id
    name
    status
    startDate
    endDate
    createdAt
    description
    isPrivate
    photoUrl
    creator {
      name
    }
    participations {
      id
      startDate
      endDate
      user {
        name
      }
    }
  }
`;
