import styled from "styled-components";
import {
  p_14_normal,
  p_16_semibold,
  p_20_semibold,
  text_dark_major,
  text_dark_minor,
} from "@osn/common-ui";

export const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  color: ${text_dark_major};
  ${p_20_semibold};
`;

export const ModalDescription = styled.p`
  color: ${text_dark_minor};
  ${p_14_normal};
`;

export const FormLabel = styled.h4`
  margin-top: 0;
  margin-bottom: 8px;
  color: ${text_dark_major};
  ${p_16_semibold};
`;

export const ButtonGroup = styled.div`
  button + button {
    margin-left: 20px;
  }
`;
