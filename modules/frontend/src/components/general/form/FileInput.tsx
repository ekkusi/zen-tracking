import { Box, InputProps, Button, ButtonProps, Input } from "@chakra-ui/react";
import React from "react";

type FileInputProps = InputProps & {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonLabel?: string;
  buttonProps?: ButtonProps;
};

const FileInput = ({
  id,
  onChange,
  buttonLabel,
  buttonProps,
  ...rest
}: FileInputProps): JSX.Element => {
  return (
    <Box>
      <Input
        id={id}
        type="file"
        visibility="hidden"
        onChange={onChange}
        display="none"
        {...rest}
      />
      <Button as="label" htmlFor={id} {...buttonProps}>
        {buttonLabel || "Valitse tiedosto"}
      </Button>
    </Box>
  );
};

export default FileInput;
