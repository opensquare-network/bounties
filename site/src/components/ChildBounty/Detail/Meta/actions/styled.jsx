import styled, { css } from "styled-components";
import {
  p_14_medium,
  p_14_normal,
  p_16_semibold,
  p_20_semibold,
  secondary_red_500,
  text_dark_accessory,
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
  margin-top: 20px;
  margin-bottom: 8px;
  color: ${text_dark_major};
  ${p_16_semibold};
`;
export const FormLabelTip = styled.span`
  ${p_14_normal};
  color: ${text_dark_accessory};

  ${(p) =>
    p.error &&
    css`
      color: ${secondary_red_500};
    `}
`;
export const FormLabelWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 8px;
  ${FormLabel} {
    margin: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  button + button {
    margin-left: 20px;
  }
`;

export const ButtonText = styled.span`
  display: inline-flex;
  color: ${text_dark_minor};
  ${p_14_medium};
`;

export const Gap = styled.span`
  margin: 0 4px;
`;

/**
 * NOTE: hack way to hide features
 */
export const TextEditorWrapper = styled.div`
  & .rich-editor {
    & .editor-toolbar {
      /* write/preview buttons */
      div:first-child {
        /* preview button */
        button:last-child {
          display: none;
        }
      }
      /* toolbar buttons */
      div:last-child {
        display: none;
      }
    }
  }
`;
