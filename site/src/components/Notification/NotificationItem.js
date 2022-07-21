// copied from qa

import styled from "styled-components";
import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import {
  Time,
  Card,
  Flex,
  FlexBetween,
  MentionIdentityUser,
  LinkIdentityUser,
  Dot,
} from "@osn/common-ui";
import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import {
  text_dark_minor,
  primary_turquoise_500,
  text_dark_accessory,
} from "@osn/common-ui/es/styles/colors";
import { ReactComponent as CheckIcon } from "@osn/common-ui/es/imgs/icons/check.svg";
import { Link } from "react-router-dom";
import { MOBILE_SIZE } from "@osn/constants";
import { useState } from "react";

const NotificationItemWrapper = styled.div`
  &:hover {
    .unread-dot {
      display: none;
    }
    .check-icon {
      display: block;
      path {
        fill: ${text_dark_accessory};
      }
    }
  }
`;
const Head = styled(Flex)`
  @media screen and (max-width: ${MOBILE_SIZE}px) {
    display: block;
  }
`;
const TitleWrapper = styled(Flex)`
  flex: 1;
  max-width: 50%;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    max-width: 100%;
    display: block;
  }
`;
const InfoWrapper = styled(FlexBetween)`
  flex: 1;
  max-width: 50%;
  display: flex;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    max-width: 100%;
    margin-top: 6px;
  }
`;
const Type = styled.div`
  text-transform: capitalize;
  color: ${text_dark_minor};

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    &::after {
      display: none;
    }
  }
`;
const Amount = styled.span`
  ${p_14_medium};
  white-space: nowrap;
  margin: 0;
`;
const Title = styled.p`
  ${p_14_medium};
  margin: 0;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }

  @media screen and (min-width: ${MOBILE_SIZE - 1}px) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    margin-top: 4px;
  }
`;

const LinkIdentityUserWrapper = styled(Flex)`
  flex: 1;
  a {
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`;
const TimeWrapper = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
`;
const StatusWrapper = styled(Flex)`
  flex: 1;
  width: 18px;
  height: 18px;
  justify-content: flex-end;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    display: none;
  }
`;
const MarkAsReadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background-color: transparent;

  .check-icon {
    display: none;
  }

  &:hover {
    .unread-dot {
      display: none;
    }

    .check-icon {
      display: block;

      path {
        fill: ${text_dark_minor};
      }
    }
  }
`;
const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${primary_turquoise_500};
`;

const assertType = (t = [], expect) => t.includes(expect);
const resolveItemState = (t = []) => {
  const value = {
    type: "",
    shouldShowAmount: false,
    shouldShowAnswer: false,
  };

  if (assertType(t, "topicResolved")) {
    value.type = "resolved";
  } else if (assertType(t, "support")) {
    value.type = "promised";
    value.shouldShowAmount = true;
  } else if (assertType(t, "fund")) {
    value.type = "funded";
    value.shouldShowAmount = true;
  } else if (assertType(t, "mention")) {
    value.type = "mentioned";
    value.shouldShowAnswer = true;
  } else if (assertType(t, "reply")) {
    value.type = "replied";
    value.shouldShowAnswer = true;
  }

  return value;
};

export default function NotificationItem({ data, onMarkAsRead = () => {} }) {
  const {
    type: origType,
    read: origRead,
    data: { byWho, topic, answer, support, fund },
  } = data;

  const [read, setRead] = useState(origRead);

  const { type, shouldShowAmount, shouldShowAnswer } =
    resolveItemState(origType);

  function handleMarkAsRead(data) {
    onMarkAsRead(data);
    setRead(true);
  }

  let titlePrefix;
  if (shouldShowAmount) {
    const { bounty } = { ...support, ...fund };

    titlePrefix = (
      <>
        <Amount>
          {bounty?.value} {bounty?.symbol}
        </Amount>
        <Dot />
      </>
    );
  }

  return (
    <NotificationItemWrapper>
      <Card
        size="small"
        head={
          <Head>
            <TitleWrapper>
              <Type>{type}</Type>
              <Dot />
              {titlePrefix}
              <Title>
                <Link to={`/topic/${topic.cid}`}>{topic.title}</Link>
              </Title>
            </TitleWrapper>

            <InfoWrapper>
              <LinkIdentityUserWrapper>
                {byWho && (
                  <LinkIdentityUser
                    hashRoute
                    items={["avatarIcon", "networkIcon", "text"]}
                    address={byWho.address}
                    network={byWho.network}
                  />
                )}
              </LinkIdentityUserWrapper>

              <TimeWrapper>
                <Time time={topic.createdAt} />
              </TimeWrapper>

              <StatusWrapper>
                {!read ? (
                  <MarkAsReadButton onClick={() => handleMarkAsRead(data)}>
                    <UnreadDot className="unread-dot" />
                    <CheckIcon className="check-icon" />
                  </MarkAsReadButton>
                ) : (
                  <div />
                )}
              </StatusWrapper>
            </InfoWrapper>
          </Head>
        }
      >
        {shouldShowAnswer && (
          <MarkdownPreviewer
            content={answer.content}
            allowedTags={["a"]}
            maxLines={3}
            plugins={[
              renderMentionIdentityUserPlugin(
                <MentionIdentityUser hashRoute />,
              ),
            ]}
          />
        )}
      </Card>
    </NotificationItemWrapper>
  );
}
