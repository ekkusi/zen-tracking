import React, { useState } from "react";
import {
  Box,
  BoxProps,
  Image as ChakraImage,
  ImageProps as ChakraImageProps,
} from "@chakra-ui/react";

type ImageProps = ChakraImageProps & {
  loadingSrc?: string;
  isBgImg?: boolean;
};

const Image = ({
  loadingSrc = "/photos/placeholder.jpg",
  src,
  isBgImg = false,
  ...rest
}: ImageProps): JSX.Element => {
  const [srcLoading, setSrcLoading] = useState(true);
  return (
    <>
      {!isBgImg ? (
        <>
          {srcLoading && <ChakraImage src={loadingSrc} {...rest} />}
          <ChakraImage
            src={src}
            display={srcLoading ? "none" : "block"}
            {...rest}
            onLoad={() => setSrcLoading(false)}
          />
        </>
      ) : (
        <Box
          background={`black url(${src})`}
          {...(rest as BoxProps)}
          backgroundRepeat="no-repeat"
          backgroundPosition="center center"
          backgroundSize="cover"
        />
      )}
    </>
  );
};

export default Image;
