import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  challengeDataFragment,
  participationInfoFragment,
  userDataFragment,
} from "fragments";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($activeParticipationId: ID) {
    getCurrentUser {
      ...UserData
      activeParticipation(id: $activeParticipationId) {
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

export const GET_CHALLENGES = gql`
  query GetChallenges($filters: ChallengeFilters) {
    getChallenges(filters: $filters) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

export const GET_PARTICIPATIONS = gql`
  query GetParticipations($filters: ParticipationFilters) {
    getParticipations(filters: $filters) {
      ...ParticipationInfo
    }
  }
  ${participationInfoFragment}
`;

export const GET_PARTICIPATION = gql`
  query GetParticipation($id: ID!) {
    getParticipation(id: $id) {
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

export const GET_PARTICIPATIONS_PLAIN = gql`
  query GetParticipationsPlain($filters: ParticipationFilters) {
    getParticipations(filters: $filters) {
      id
      startDate
      endDate
      challenge {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($name: ID!, $activeParticipationId: ID) {
    getUser(name: $name) {
      ...UserData
      activeParticipation(id: $activeParticipationId) {
        ...ActiveParticipationInfo
      }
    }
  }
  ${userDataFragment}
  ${activeParticipationInfoFragment}
`;

export const ADD_FINISHED_PARTICIPATION = gql`
  mutation AddFinishedParticipation($id: ID!) {
    addFinishedParticipation(id: $id)
  }
`;
