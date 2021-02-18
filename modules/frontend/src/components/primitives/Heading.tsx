import { Heading as ChakraHeading, HeadingProps } from "@chakra-ui/react";
import React from "react";

type HeadingType = {
  H1: (props: HeadingProps) => JSX.Element;
  H2: (props: HeadingProps) => JSX.Element;
  H3: (props: HeadingProps) => JSX.Element;
};

const Heading: HeadingType = {
  H1: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading
      as="h1"
      fontSize={{ base: "2xl", md: "4xl" }}
      mb={{ base: "3", md: "4" }}
      {...rest}
    >
      {children}
    </ChakraHeading>
  ),
  H2: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading
      as="h2"
      fontSize={{ base: "xl", md: "2xl" }}
      mb={{ base: "2", md: "3" }}
      fontWeight="normal"
      {...rest}
    >
      {children}
    </ChakraHeading>
  ),
  H3: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading
      as="h3"
      fontSize={{ base: "lg", md: "xl" }}
      mb={{ base: "1", md: "2" }}
      fontWeight="normal"
      {...rest}
    >
      {children}
    </ChakraHeading>
  ),
};

export default Heading;
