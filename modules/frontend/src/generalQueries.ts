import { gql } from "@apollo/client";
import { activeParticipationInfoFragment, userDataFragment } from "fragments";

export const GET_CURRENT_USER = gql`
  query GetCurrentUserQuery($activeParticipationChallengeId: ID) {
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
  mutation LogoutMutation {
    logout
  }
`;

export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipationsQuery {
    getUserParticipations {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_PARTICIPATION = gql`
  query GetParticipationQuery($challengeId: ID!) {
    getParticipation(challengeId: $challengeId) {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_USER_TRANSFER_PARTICIPATION = gql`
  query GetUserTransferParticipationQuery {
    getUserTransferParticipation {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_USER_PARTICIPATIONS_PLAIN = gql`
  query GetUserParticipationsPlainQuery {
    getUserParticipations {
      id
      challenge {
        id
        name
      }
    }
  }
`;
