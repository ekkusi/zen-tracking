import { gql } from "@apollo/client";
import { markingDataFragment, userDataFragment } from "fragments";

export const GET_USER = gql`
  query GetUserQuery($name: ID!) {
    getUser(name: $name) {
      ...UserData
    }
  }
  ${userDataFragment}
`;

const getUserParticipationInfoFragment = gql`
  fragment GetUserParticipationInfo on ChallengeParticipation {
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

export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipationsQuery($userName: ID!) {
    getUserParticipations(userName: $userName) {
      ...GetUserParticipationInfo
    }
  }
  ${getUserParticipationInfoFragment}
`;

export const GET_PARTICIPATION = gql`
  query GetParticipationQuery($challengeId: ID!) {
    getParticipation(challengeId: $challengeId) {
      ...GetUserParticipationInfo
    }
  }
  ${getUserParticipationInfoFragment}
`;

export const GET_USER_TRANSFER_PARTICIPATION = gql`
  query GetUserTransferParticipationQuery($userName: ID!) {
    getUserTransferParticipation(userName: $userName) {
      ...GetUserParticipationInfo
    }
  }
  ${getUserParticipationInfoFragment}
`;

export const GET_USER_PARTICIPATIONS_PLAIN = gql`
  query GetUserParticipationsPlainQuery($userName: ID!) {
    getUserParticipations(userName: $userName) {
      id
      challenge {
        id
        name
      }
    }
  }
`;
