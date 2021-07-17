import { gql } from "@apollo/client";

export const TRANSFER_MARKINGS = gql`
  mutation TransferMarkings($challengeId: ID!) {
    transferUserMarkings(challengeId: $challengeId)
  }
`;

export const GET_TRANSFERABLE_CHALLENGES = gql`
  query GetTransferableChallenges($filters: ChallengeFilters!) {
    getChallenges(filters: $filters) {
      id
      name
      startDate
      endDate
    }
  }
`;
