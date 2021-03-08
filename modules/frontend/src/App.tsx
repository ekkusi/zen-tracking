import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import Routes from "routes/Routes";
import { ThemeProvider } from "styled-components";

import theme from "./theme";

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
