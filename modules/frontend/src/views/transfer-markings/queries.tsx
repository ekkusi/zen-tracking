import { gql } from "@apollo/client";

export const TRANSFER_MARKINGS = gql`
  mutation TransferMarkingsMutation($userName: ID!, $challengeId: ID!) {
    transferUserMarkings(userName: $userName, challengeId: $challengeId)
  }
`;

export const GET_TRANSFERABLE_CHALLENGES = gql`
  query GetTransferableChallengesQuery(
    $startDate: DateFilter!
    $endDate: DateFilter!
  ) {
    getChallenges(startDate: $startDate, endDate: $endDate) {
      id
      name
      startDate
      endDate
    }
  }
`;
