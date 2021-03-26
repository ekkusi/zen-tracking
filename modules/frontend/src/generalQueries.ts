import { gql } from "@apollo/client";
import { activeParticipationInfoFragment, userDataFragment } from "fragments";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($activeParticipationChallengeId: ID) {
    getCurrentUser {
      ...UserData
      activeParticipation(challengeId: $activeParticipationChallengeId) {
        ...ActiveParticipationInfo
      }
    }
  }
  ${userDataFragment}
  ${activeParticipationInfoFragment}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipations {
    getUserParticipations {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_PARTICIPATION = gql`
  query GetParticipation($challengeId: ID!) {
    getParticipation(challengeId: $challengeId) {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_USER_TRANSFER_PARTICIPATION = gql`
  query GetUserTransferParticipation {
    getUserTransferParticipation {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_USER_PARTICIPATIONS_PLAIN = gql`
  query GetUserParticipationsPlain {
    getUserParticipations {
      id
      challenge {
        id
        name
      }
    }
  }
`;
