import React from "react";
import { Text, TextProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";

type BackNavigationLinkProps = TextProps & {
  children: string;
  to: string;
};

const BackNavigationLink = ({
  to,
  children,
  ...textProps
}: BackNavigationLinkProps): JSX.Element => {
  return (
    <Text as={Link} to={to} fontSize="lg" display="block" mb="5" {...textProps}>
      {children}
    </Text>
  );
};

export default BackNavigationLink;
