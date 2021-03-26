import { gql } from "@apollo/client";
import { challengeWithParticipationsFragment } from "../queries";

export const GET_CHALLENGE = gql`
  query GetChallenge($id: ID!) {
    getChallenge(id: $id) {
      ...ChallengeWithParticipations
    }
  }
  ${challengeWithParticipationsFragment}
`;
