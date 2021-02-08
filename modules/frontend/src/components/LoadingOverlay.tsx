import React from "react";
import LoadingOverlay from "react-loading-overlay";
import styled from "styled-components";

const StyledLoader = styled(LoadingOverlay)`
  width: 100%;
  height: 100vh;
  overflow: scroll;
  .MyLoader_overlay {
    background: rgba(255, 255, 255, 0.5);
    color: ${({ theme }) => theme.colors.primary.regular};
  }
  .MyLoader_spinner svg circle {
    stroke: ${({ theme }) => theme.colors.primary.regular};
  }
`;

type LoadingOverlayProps = {
  loadingText?: string;
};

const CustomLoadingOverlay = ({
  loadingText,
}: LoadingOverlayProps): JSX.Element => {
  return (
    <StyledLoader
      active
      spinner
      classNamePrefix="MyLoader_"
      text={loadingText}
    />
  );
};

CustomLoadingOverlay.defaultProps = {
  loadingText: "Lataillaan...",
};

export default CustomLoadingOverlay;
