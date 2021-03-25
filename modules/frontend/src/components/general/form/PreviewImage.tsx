import { Box, CloseButton, ImageProps } from "@chakra-ui/react";
import React from "react";
import Image from "../../primitives/Image";

type PreviewImageProps = ImageProps & {
  onClose: () => void;
};

const PreviewImage = ({
  onClose,
  borderRadius = "10px",
  boxSize,
  ...imageProps
}: PreviewImageProps): JSX.Element => {
  return (
    <Box
      position="relative"
      borderRadius={borderRadius}
      boxSize={boxSize}
      border="1px solid transparent"
    >
      <CloseButton
        borderRadius="100%"
        color="white"
        bg="black"
        _hover={{
          bg: "black",
          color: "white",
          opacity: 0.7,
        }}
        size="lg"
        position="absolute"
        left="5px"
        top="5px"
        onClick={onClose}
      />
      <Image {...imageProps} borderRadius={borderRadius} overflow="hidden" />
    </Box>
  );
};

export default PreviewImage;
