import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import Routes from "routes/Routes";
import { ThemeProvider } from "styled-components";
import useGlobal from "./store";

import theme from "./theme";

const App = (): JSX.Element => {
  const [user] = useGlobal((store) => store.currentUser);

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <BrowserRouter>
            <Container maxWidth="1000px" minHeight="100vh">
              <Routes />
            </Container>
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
