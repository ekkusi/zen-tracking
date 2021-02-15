import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/link-error";
import useGlobal from "store";

const isProduction = process.env.NODE_ENV === "production";

const CustomApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const setError = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  )[1];
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    } else if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      setError(
        `Jotakin meni vikaan tietojesi hakemisessa. Kokeile kirjautua uudestaan. Mikäli tämä virheviesti esiintyy uudelleen, ota yhteyttä ekeukkoon!`
      );
    }
  });

  const httpLink = new HttpLink({
    uri: isProduction ? "/graphql" : "http://localhost:4000/graphql",
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
