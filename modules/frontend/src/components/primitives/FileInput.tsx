import { Box, Input } from "@chakra-ui/react";
import React from "react";
import { ButtonWithRef } from "./Button";

type FileInputProps = {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileInput = ({ id, onChange }: FileInputProps): JSX.Element => {
  return (
    <Box>
      <Input
        type="file"
        visibility="hidden"
        id={id}
        onChange={onChange}
        display="none"
      />
      <ButtonWithRef as="label" htmlFor={id} p="2" w="auto">
        Valitse tiedosto
      </ButtonWithRef>
    </Box>
  );
};

export default FileInput;
