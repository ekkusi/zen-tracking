import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = (): JSX.Element => (
  <Box p="5">
    <Heading as="h1" size="2xl">
      404
    </Heading>
    <Text>Hakemaasi sivua ei löytynyt:/</Text>
    <Link to="/">
      <Text fontWeight="bold">Siirry takaisin etusivulle</Text>
    </Link>
  </Box>
);

export default NotFoundPage;
