import { gql } from "@apollo/client";
import { markingDataFragment, userDataFragment } from "fragments";

export const GET_CURRENT_USER = gql`
  query GetCurrentUserQuery {
    getCurrentUser {
      ...UserData
    }
  }
  ${userDataFragment}
`;

export const LOGOUT = gql`
  mutation LogoutMutation {
    logout
  }
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
  query GetUserParticipationsQuery {
    getUserParticipations {
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
  query GetUserTransferParticipationQuery {
    getUserTransferParticipation {
      ...GetUserParticipationInfo
    }
  }
  ${getUserParticipationInfoFragment}
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
