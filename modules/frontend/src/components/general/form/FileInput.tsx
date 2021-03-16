import { Box, InputProps } from "@chakra-ui/react";
import { PrimaryInput } from "components/primitives/Input";
import React from "react";
import { ButtonWithRef, ButtonProps } from "../../primitives/Button";

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
      <PrimaryInput
        id={id}
        type="file"
        visibility="hidden"
        onChange={onChange}
        display="none"
        {...rest}
      />
      <ButtonWithRef as="label" htmlFor={id} p="2" w="auto" {...buttonProps}>
        {buttonLabel || "Valitse tiedosto"}
      </ButtonWithRef>
    </Box>
  );
};

export default FileInput;
