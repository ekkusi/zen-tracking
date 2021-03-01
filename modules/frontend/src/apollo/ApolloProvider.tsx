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
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      const errorStrings = graphQLErrors.map((error) => {
        console.error(error);
        return error.message;
      });
      setError(errorStrings.join("\n"));
    }

    // GraphQlErrors should handle this aswell now like when graphql query is bad on client -> giving bad request.
    // If there comes some case, where this is better than above, remove comments and modify
    // if (networkError) {
    //   console.error(`[Network error]: ${networkError}`);
    //   setError(
    //     `Jotakin meni vikaan tietojesi hakemisessa. Kokeile kirjautua uudestaan. Mikäli tämä virheviesti esiintyy uudelleen, ota yhteyttä ekeukkoon!`
    //   );
    // }
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
