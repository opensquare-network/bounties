import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";

import { removeToast, ToastTypes } from "store/reducers/toastSlice";
import { ReactComponent as Close } from "./icons/close.svg";
import { ReactComponent as Sticky } from "./icons/sticky.svg";
import { useIsMounted } from "@osn/common/src/utils/hooks";
import {
  p_14_normal,
  p_16_semibold,
} from "@osn/common-ui/es/styles/textStyles";

const Wrapper = styled.div`
  padding: 20px;
  width: 400px;
  background: #ffffff;
  filter: drop-shadow(0px 4px 31px rgba(26, 33, 44, 0.06))
    drop-shadow(0px 0.751293px 8px rgba(26, 33, 44, 0.04));
  color: rgba(17, 17, 17, 0.65);
  display: flex;
  align-items: flex-start;
  border-left: 4px solid #ffffff;
  ${(p) =>
    p.color &&
    css`
      border-left-color: ${p.color};
    `}
  @media screen and (max-width: 500px) {
    width: auto;
  }
  transform: translateX(200%);
  transition: all 0.25s ease-out;
  &.tran {
    transform: translateX(0) !important;
  }
`;

const LeftWrapper = styled.div`
  flex: 1 1 auto;
`;

const Title = styled.div`
  ${p_16_semibold};
  margin-bottom: 4px;
`;

const Content = styled.div`
  ${p_14_normal};
  color: #506176;
  word-wrap: break-word;
  word-break: break-all;
`;

const RightWrapper = styled.div`
  flex: 0 0 auto;
  cursor: pointer;
  > svg {
    path {
      fill: #9da9bb;
    }
    fill: #9da9bb;
    :hover {
      fill: #2e343d;
      path {
        fill: #2e343d;
      }
    }
  }
`;

const getToastColor = (type) => {
  switch (type) {
    case ToastTypes.Success:
      return "#4CAF50";
    case ToastTypes.Error:
      return "#EE4444";
    case ToastTypes.Info:
    case ToastTypes.Pending:
      return "#6848FF";
    default:
      return "#9DA9BB";
  }
};

const ToastItem = ({ type, title, message, id, sticky }) => {
  const dispatch = useDispatch();
  const color = getToastColor(type);
  const isMounted = useIsMounted();
  const [tranClass, setTranClass] = useState("");

  useEffect(() => {
    if (sticky) {
      return;
    }
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 5000);
  }, [dispatch, id, sticky]);

  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        setTranClass("tran");
      }
    }, 100);
  });

  if (!message) return null;
  return (
    <Wrapper color={color} className={tranClass}>
      <LeftWrapper>
        <Title>{title || type}</Title>
        <Content>{message}</Content>
      </LeftWrapper>
      <RightWrapper>
        {sticky ? (
          <Sticky />
        ) : (
          <Close onClick={() => dispatch(removeToast(id))} />
        )}
      </RightWrapper>
    </Wrapper>
  );
};

export default ToastItem;
