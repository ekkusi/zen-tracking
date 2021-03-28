import { gql } from "@apollo/client";
import { activeParticipationInfoFragment } from "../../../fragments";
import { challengeWithParticipationsFragment } from "../queries";

export const GET_CHALLENGE = gql`
  query GetChallenge($id: ID!) {
    getChallenge(id: $id) {
      ...ChallengeWithParticipations
    }
  }
  ${challengeWithParticipationsFragment}
`;

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipation($challengeId: ID!, $isPrivate: Boolean!) {
    createParticipation(challengeId: $challengeId, isPrivate: $isPrivate) {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const DELETE_PARTICIPATION = gql`
  mutation DeleteParticipation($challengeId: ID!) {
    deleteParticipation(challengeId: $challengeId)
  }
`;
