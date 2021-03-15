import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import Routes from "routes/Routes";
import { ThemeProvider } from "styled-components";
import LogRocket from "logrocket";

import ScrollToTop from "components/ScrollToTop";
import theme from "./theme";

if (process.env.NODE_ENV === "production") {
  LogRocket.init("6hrsm3/zen-tracking");
}

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes />
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
