import React, { useState } from "react";
import {
  Image as ChakraImage,
  ImageProps as ChakraImageProps,
} from "@chakra-ui/react";

type ImageProps = ChakraImageProps & {
  loadingSrc?: string;
};

const Image = ({
  loadingSrc = "/photos/placeholder.jpg",
  src,
  ...rest
}: ImageProps): JSX.Element => {
  const [srcLoading, setSrcLoading] = useState(true);
  return (
    <>
      {srcLoading && <ChakraImage src={loadingSrc} {...rest} />}
      <ChakraImage
        src={src}
        display={srcLoading ? "none" : "block"}
        {...rest}
        onLoad={() => setSrcLoading(false)}
      />
    </>
  );
};

export default Image;
