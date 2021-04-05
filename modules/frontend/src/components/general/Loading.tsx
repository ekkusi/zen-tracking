import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type LoadingProps = {
  loadingText?: string;
};

const Loading = ({ loadingText }: LoadingProps): JSX.Element => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Text fontSize="xl" colorScheme="primary">
        {loadingText}
      </Text>
      <Spinner mb="3" size="xl" thickness="3px" ml="3" />
    </Flex>
  );
};

Loading.defaultProps = {
  loadingText: "Lataillaan...",
};

export default Loading;
