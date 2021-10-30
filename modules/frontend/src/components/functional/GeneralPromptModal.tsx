import React from "react";
import useGlobal from "../../store";
import ConfirmationModal from "../general/ConfirmationModal";

const GeneralPromptModal = (): JSX.Element | null => {
  const modalProps = useGlobal((state) => state.modalProps)[0];

  if (modalProps) return <ConfirmationModal {...modalProps} />;
  // This is for calling set modal outside react components, for example service worker update

  return null;
};

export default GeneralPromptModal;
