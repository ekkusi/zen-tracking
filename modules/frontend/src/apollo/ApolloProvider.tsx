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
  const [globalError, setGlobalError] = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  );
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    let settingGlobalError = false; // Need this for networkError if check, because setGlobalError is not triggered instantly
    if (
      graphQLErrors &&
      graphQLErrors.length > 0 &&
      !settingGlobalError &&
      !globalError
    ) {
      settingGlobalError = true;
      setGlobalError(graphQLErrors[0].message);
    }

    console.log("Setting networkError");

    // If globalError is not yet set and networkError is returned, set this as global error
    if (networkError && !globalError && !settingGlobalError) {
      setGlobalError(
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
