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

const CustomApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [error, setError] = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  );
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

  const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
