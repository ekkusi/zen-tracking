import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import Routes from "routes/Routes";
import { ThemeProvider } from "styled-components";

import ScrollToTop from "components/functional/ScrollToTop";
import theme from "./theme";
import Fonts from "./Fonts";
import AddToHomeScreenPrompt from "./components/functional/AddToHomeScreenPrompts";

const App = (): JSX.Element => {
  const hasUserSeenInstallPrompt = localStorage.getItem(
    "hasUserSeenInstallPrompt"
  );

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <ThemeProvider theme={theme}>
        {/* @ts-ignore */}
        <BrowserRouter>
          <ApolloProvider>
            <ScrollToTop />
            <AddToHomeScreenPrompt />
            <Routes />
          </ApolloProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
