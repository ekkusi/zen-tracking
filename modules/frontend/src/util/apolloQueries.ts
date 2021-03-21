import { ApolloQueryResult } from "@apollo/client";
import { initializeApollo } from "../apollo/ApolloProvider";
import { GET_PARTICIPATION } from "../generalQueries";
import {
  GetParticipationQuery,
  GetParticipationQueryVariables,
} from "../__generated__/GetParticipationQuery";

const client = initializeApollo();

export const getParticipation = async (
  variables: GetParticipationQueryVariables
): Promise<ApolloQueryResult<GetParticipationQuery>> => {
  return client.query<GetParticipationQuery, GetParticipationQueryVariables>({
    query: GET_PARTICIPATION,
    variables,
  });
};
