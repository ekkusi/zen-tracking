import React, { useEffect, useState } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import ApolloProvider from "apollo/ApolloProvider";
import Login from "./views/login/Login";
import MainView from "./views/main/Main";

import theme from "./theme";

const App = (): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    console.log(currentUser);
    // If localstorage login is found, set user as logged in
    if (currentUser && !isLoggedIn) {
      setIsLoggedIn(true);
    }
    // If username isn't found from localstorage but user is still set as logged in, log out
    if (!currentUser && isLoggedIn) {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const login = (username: string) => {
    localStorage.setItem("currentUser", username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider>
        <Container maxWidth="1000px" minHeight="100vh">
          {isLoggedIn ? <MainView logout={logout} /> : <Login login={login} />}
        </Container>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
