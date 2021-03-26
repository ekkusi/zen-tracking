import { ApolloQueryResult } from "@apollo/client";
import { initializeApollo } from "../apollo/ApolloProvider";
import { GET_PARTICIPATION } from "../generalQueries";
import {
  GetParticipation,
  GetParticipationVariables,
} from "../__generated__/GetParticipation";

const client = initializeApollo();

export const getParticipation = async (
  variables: GetParticipationVariables
): Promise<ApolloQueryResult<GetParticipation>> => {
  return client.query<GetParticipation, GetParticipationVariables>({
    query: GET_PARTICIPATION,
    variables,
  });
};
