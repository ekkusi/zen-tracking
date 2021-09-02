import { gql } from "@apollo/client";
import { challengeDataFragment } from "../../../fragments";

export const GET_CHALLENGE = gql`
  query GetChallenge($id: ID!) {
    getChallenge(id: $id) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;
