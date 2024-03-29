import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ApolloProvider from "apollo/ApolloProvider";
import Routes from "routes/Routes";
import { ThemeProvider } from "styled-components";

import ScrollToTop from "components/functional/ScrollToTop";
import theme from "./theme";
import Fonts from "./theme/Fonts";
import AddToHomeScreenPrompt from "./components/functional/AddToHomeScreenPrompts";
import GeneralPromptModal from "./components/functional/GeneralPromptModal";
import NewVersionPrompt from "./components/functional/NewVersionPrompt";

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ApolloProvider>
            <ScrollToTop />
            <AddToHomeScreenPrompt />
            <NewVersionPrompt />
            <GeneralPromptModal />
            <Routes />
          </ApolloProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
