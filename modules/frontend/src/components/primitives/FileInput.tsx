import { Input } from "@chakra-ui/react";
import React from "react";
import { ButtonWithRef } from "./Button";

type FileInputProps = {
  id: string;
};

const FileInput = ({ id }: FileInputProps): JSX.Element => {
  return (
    <>
      <Input type="file" visibility="hidden" id={id} />
      <ButtonWithRef as="label" for={id} p="2" w="auto">
        Valitse tiedosto
      </ButtonWithRef>
    </>
  );
};

export default FileInput;
