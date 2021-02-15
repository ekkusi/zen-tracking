import { Heading as ChakraHeading, HeadingProps } from "@chakra-ui/react";
import React from "react";

type HeadingType = {
  H1: (props: HeadingProps) => JSX.Element;
  H2: (props: HeadingProps) => JSX.Element;
  H3: (props: HeadingProps) => JSX.Element;
};

const Heading: HeadingType = {
  H1: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading as="h1" size="xl" {...rest}>
      {children}
    </ChakraHeading>
  ),
  H2: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading as="h2" size="lg" fontWeight="normal" {...rest}>
      {children}
    </ChakraHeading>
  ),
  H3: ({ children, ...rest }: HeadingProps) => (
    <ChakraHeading as="h3" size="md" fontWeight="normal" {...rest}>
      {children}
    </ChakraHeading>
  ),
};

export default Heading;
