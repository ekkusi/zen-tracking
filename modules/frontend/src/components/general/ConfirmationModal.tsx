import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import ModalTemplate, { ModalTemplateProps } from "./ModalTemplate";

export type ConfirmationModalProps = Omit<ModalTemplateProps, "openButton"> & {
  onAccept: () => Promise<void> | void;
  variant?: "regular" | "delete";
  acceptLabel?: string;
  cancelLabel?: string;
  hasCancelButton?: boolean;
};

const ConfirmationModal = ({
  onAccept,
  onClose,
  variant = "regular",
  acceptLabel = "Poista",
  cancelLabel = "Peruuta",
  openButtonLabel = "Poista",
  hasCancelButton = true,
  isOpen: isModalOpen = false,
  ...modalTemplateProps
}: ConfirmationModalProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(isModalOpen);

  const disclosureProps = useDisclosure({
    isOpen,
    onClose: () => {
      if (onClose) onClose();
      setIsOpen(false);
    },
  });

  const acceptAndClose = async () => {
    setLoading(true);
    await onAccept();
    setLoading(false);
    disclosureProps.onClose();
  };

  return (
    <ModalTemplate
      headerLabel="Oletko varma?"
      openButtonLabel="Poista"
      openButton={
        <Button
          variant={variant === "delete" ? "alert" : "solid"}
          onClick={() => setIsOpen(true)}
          {...modalTemplateProps.openButtonProps}
        >
          {openButtonLabel}
        </Button>
      }
      modalFooter={
        <>
          <Button
            variant={variant === "delete" ? "alert" : "solid"}
            isLoading={loading}
            onClick={acceptAndClose}
            mr="3"
          >
            {acceptLabel}
          </Button>
          {hasCancelButton && (
            <Button
              variant="ghost"
              isDisabled={loading}
              onClick={() => disclosureProps.onClose()}
            >
              {cancelLabel}
            </Button>
          )}
        </>
      }
      {...modalTemplateProps}
      {...disclosureProps}
    />
  );
};

export default ConfirmationModal;
