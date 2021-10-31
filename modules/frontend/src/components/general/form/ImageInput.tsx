import { Box, BoxProps, ButtonProps, Icon } from "@chakra-ui/react";

import React, { useEffect, useMemo, useState } from "react";
import { IoMdCamera } from "react-icons/io";
import FileInput, { FileInputProps } from "./FileInput";
import PreviewImage from "./PreviewImage";

type ImageInputProps = Omit<FileInputProps, "onChange"> & {
  initialValue?: string | File | null;
  onChange: (file: File | null) => void;
  buttonProps?: ButtonProps;
  containerProps?: BoxProps;
};

const ImageInput = ({
  initialValue,
  onChange: customOnChange,
  buttonProps,
  containerProps,
  ...inputProps
}: ImageInputProps): JSX.Element => {
  const [photoSrc, setPhoto] = useState<File | null | string>(null);

  useEffect(() => {
    if (initialValue !== undefined && initialValue !== photoSrc) {
      setPhoto(initialValue);
    }
  }, [initialValue, photoSrc]);

  const getPhotoSrc = useMemo(() => {
    if (!photoSrc) return undefined;
    if (typeof photoSrc === "string") {
      return photoSrc;
    }
    return URL.createObjectURL(photoSrc);
  }, [photoSrc]);

  return (
    <Box {...containerProps}>
      {photoSrc ? (
        <PreviewImage
          maxWidth="100%"
          maxHeight="300px"
          src={getPhotoSrc}
          onClose={() => {
            setPhoto(null);
            customOnChange(null);
          }}
        />
      ) : (
        <FileInput
          accept="image/*"
          buttonLabel="Valitse kuva"
          buttonProps={{
            rightIcon: <Icon as={IoMdCamera} w={4} h={4} mb="1px" ml="1" />,
            ...buttonProps,
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newPhoto =
              event.target.files == null || event.target.files.length <= 0
                ? null
                : event.target.files[0];
            setPhoto(newPhoto);
            customOnChange(newPhoto);
          }}
          {...inputProps}
        />
      )}
    </Box>
  );
};

export default ImageInput;
