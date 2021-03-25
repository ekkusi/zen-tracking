import { Box, ImageProps, Text } from "@chakra-ui/react";
import React from "react";
import ModalTemplate from "./ModalTemplate";
import Image from "../primitives/Image";

export type ImageModalProps = ImageProps & {
  isOpen: boolean;
  onClose: () => void;
  imgText?: string | JSX.Element;
};

const ImageModal = ({
  isOpen,
  onClose,
  imgText,
  ...imageProps
}: ImageModalProps): JSX.Element => {
  const borderRadius = imageProps.borderRadius || "10px";
  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      hasHeader={false}
      hasFooter={false}
      hasOpenButton={false}
      modalContentProps={{
        borderRadius,
        width: "auto",
      }}
      modalBodyProps={{
        borderRadius,
        p: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: "-1",
      }}
    >
      <>
        <Image borderRadius={borderRadius} boxSize="500px" {...imageProps} />
        {imgText && (
          <Box position="absolute" bottom="0" ml="3" mb="2">
            <Text as="span" mb="0" color="secondary.regular">
              {imgText}
            </Text>
          </Box>
        )}
      </>
    </ModalTemplate>
  );
};

export default ImageModal;
