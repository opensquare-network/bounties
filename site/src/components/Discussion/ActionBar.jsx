import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as ReplyIcon } from "imgs/icons/reply.svg";
import Flex from "@osn/common-ui/es/styled/Flex";
import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";
import { p_14_normal } from "@osn/common-ui";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";
import { useOnClickOutside } from "@osn/common";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 8px;

  svg.more {
    cursor: pointer;

    &:hover * {
      fill: #506176;
    }
  }
`;

const ReplyButton = styled(Flex)`
  cursor: pointer;
  margin-right: 20px;
  color: #a1a8b3;

  :hover {
    color: #506176;

    > svg path {
      fill: #506176;
    }
  }
`;

const Reply = styled.div`
  ${p_14_normal};
  margin-left: 8px;
`;

const MoreActions = styled.div`
  padding: 16px;
  display: flex;
  gap: 8px;
  position: absolute;
  right: 0;
  top: 26px;
  background-color: white;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
`;

const MoreActionItem = styled(FlexBetween)`
  user-select: none;
  width: 128px;
  cursor: pointer;
  color: #506176;
  &:hover {
    color: #1e2134;
  }
`;

export default function ActionBar({ network, address, onReply = () => {} }) {
  // FIXME: remove this
  // eslint-disable-next-line
  const [showReport, setShowReport] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const account = useSelector(accountSelector);

  const buttonRef = useRef(null);
  useOnClickOutside(buttonRef, () => setShowMoreActions(false));

  const onReplyClick = useCallback(() => {
    onReply({ network, address });
  }, [network, address, onReply]);

  return (
    <Wrapper>
      <FlexBetween>
        <Flex>
          <ReplyButton onClick={onReplyClick}>
            <ReplyIcon />
            <Reply>Reply</Reply>
          </ReplyButton>
        </Flex>
        {account && (
          <div ref={buttonRef}>
            {showMoreActions && (
              <MoreActions>
                <MoreActionItem
                  onClick={() => {
                    setShowMoreActions(false);
                    setShowReport(true);
                  }}
                >
                  <span>Report</span>
                  <img src="/imgs/icons/exclamation.svg" alt="" />
                </MoreActionItem>
              </MoreActions>
            )}
          </div>
        )}
      </FlexBetween>
    </Wrapper>
  );
}
