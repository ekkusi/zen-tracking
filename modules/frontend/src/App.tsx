import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import useGlobal from "./store";
import Login from "./views/login/Login";
import MainView from "./views/main/Main";

import theme from "./theme";

const App = (): JSX.Element => {
  const [user] = useGlobal((store) => store.currentUser);

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider>
        <Container maxWidth="1000px" minHeight="100vh">
          {user ? <MainView /> : <Login />}
        </Container>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
