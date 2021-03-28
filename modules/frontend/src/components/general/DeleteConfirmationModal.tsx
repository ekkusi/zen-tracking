import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import ModalTemplate, { ModalTemplateProps } from "./ModalTemplate";
import { AlertButton, CancelButton } from "../primitives/Button";

type DeleteConfimationModalProps = Omit<
  ModalTemplateProps,
  "isOpen" | "onClose" | "openButton"
> & {
  onDelete: () => Promise<void> | void;
  deleteLabel?: string;
  cancelLabel?: string;
};

const DeleteConfimationModal = ({
  onDelete,
  deleteLabel = "Poista",
  cancelLabel = "Peruuta",
  openButtonLabel = "Poista",
  ...modalTemplateProps
}: DeleteConfimationModalProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const disclosureProps = useDisclosure({
    isOpen,
    onClose: () => setIsOpen(false),
  });

  const deleteAndClose = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
    disclosureProps.onClose();
  };

  return (
    <ModalTemplate
      headerLabel="Haluatko varmasti poistaa?"
      openButtonLabel="Poista"
      openButton={
        <AlertButton
          color="white"
          bg="warning"
          onClick={() => setIsOpen(true)}
          {...modalTemplateProps.openButtonProps}
        >
          {openButtonLabel}
        </AlertButton>
      }
      modalFooter={
        <>
          <AlertButton isLoading={loading} onClick={deleteAndClose} mr="3">
            {deleteLabel}
          </AlertButton>
          <CancelButton
            isDisabled={loading}
            onClick={() => disclosureProps.onClose()}
          >
            {cancelLabel}
          </CancelButton>
        </>
      }
      {...modalTemplateProps}
      {...disclosureProps}
    />
  );
};

export default DeleteConfimationModal;
