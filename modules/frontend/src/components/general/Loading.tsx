import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type LoadingProps = {
  loadingText?: string;
};

const Loading = ({ loadingText }: LoadingProps): JSX.Element => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Text fontSize="xl" color="primary.regular">
        {loadingText}
      </Text>
      <Spinner
        mb="3"
        color="primary.regular"
        size="xl"
        thickness="3px"
        ml="3"
      />
    </Flex>
  );
};

Loading.defaultProps = {
  loadingText: "Lataillaan...",
};

export default Loading;
