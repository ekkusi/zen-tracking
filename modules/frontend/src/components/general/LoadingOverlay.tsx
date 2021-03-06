import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type LoadingOverlayProps = {
  loadingText?: string;
};

const CustomLoadingOverlay = ({
  loadingText,
}: LoadingOverlayProps): JSX.Element => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="100"
    >
      <Flex
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        direction="column"
        alignItems="center"
      >
        <Spinner mb="4" colorScheme="primary" size="xl" thickness="3px" />
        <Text fontSize="xl" colorScheme="primary">
          {loadingText}
        </Text>
      </Flex>
    </Box>
  );
};

CustomLoadingOverlay.defaultProps = {
  loadingText: "Lataillaan...",
};

export default CustomLoadingOverlay;
