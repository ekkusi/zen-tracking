import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import { ThemeProvider } from "styled-components";

import ScrollToTop from "components/ScrollToTop";
import theme from "./theme";
import RedirectToNewAddress from "./views/RedirectToNewAddress";

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ApolloProvider>
            <ScrollToTop />
            <RedirectToNewAddress />
          </ApolloProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
