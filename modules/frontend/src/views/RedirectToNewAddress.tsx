import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import Heading from "../components/primitives/Heading";

const RedirectToNewAddress = (): JSX.Element => {
  return (
    <Container
      display="flex"
      min-height="100vh"
      py={{ base: "100px", sm: "200px" }}
    >
      <Box>
        <Heading.H1>Tervehdys!</Heading.H1>
        <Text>
          Zen-tracking on siirtynyt uuteen osoitteeseen. Uudet sivut löydät
          osoitteesta{" "}
          <Text as="a" href="http://zen-tracking.com">
            http://zen-tracking.com
          </Text>
        </Text>
      </Box>
    </Container>
  );
};

export default RedirectToNewAddress;
