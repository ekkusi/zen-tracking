import { BoxProps, Container } from "@chakra-ui/react";
import Navigation from "components/Navigation";
import React from "react";

type ViewContainerProps = BoxProps;

const ViewContainer = ({ children }: ViewContainerProps): JSX.Element => {
  return (
    <>
      <Navigation />
      <Container maxWidth="1000px" pb="5" pt="50px">
        {children}
      </Container>
    </>
  );
};

export default ViewContainer;
