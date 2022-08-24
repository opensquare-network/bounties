import { Button, Card, noop, notification } from "@osn/common-ui";
import {
  descriptionLoading,
  metaLoading,
} from "components/Bounty/styled/metaLoading";
import DisabledInputBountyId from "components/Common/Detail/DisabledInputBountyId";
import InputTitle from "components/Common/Import/InputTitle";
import BountySkills from "components/ChildBounty/Import/BountySkills";
import InputDescription from "components/Common/Import/InputDescription";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BountyLogo from "components/Bounty/BountyLogo";
import { accountSelector } from "store/reducers/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { signApiData } from "utils/signature";
import serverApi from "services/serverApi";
import { fetchChildBountyDetail } from "store/reducers/childBountyDetailSlice";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/es";

const Box = styled.div`
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.04),
    0px 0.751293px 3.88168px rgba(26, 33, 44, 0.03);
  border: 1px solid #f0f3f8;
  padding: 32px;
  background-color: white;
  @media screen and (max-width: 900px) {
    padding: 16px;
  }

  > :not(:first-child) {
    margin-top: 20px;
  }

  > :nth-child(5) {
    margin-top: 8px;
  }
`;

const Main = styled(Box)`
  button {
    max-width: 86px;
    float: right;
  }
`;

const HeaderText = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  color: #1e2134;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export default function ChildBountyDetailMetaEdit({
  childBountyDetail,
  onEditEnd,
}) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [selectedSkills, setSelectedSkills] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    setTitle(childBountyDetail?.title);
    setContent(childBountyDetail?.content);
    setSelectedSkills(childBountyDetail?.skills);
  }, [childBountyDetail]);

  const onUpdate = async () => {
    if (!account) {
      notification.error({
        message: "Please connect wallet",
      });
      return;
    }

    const signer = encodeNetworkAddress(account?.address, account?.network);

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
      timeout: false,
    });

    setIsLoading(true);
    try {
      const payload = await signApiData(
        {
          action: "editChildBounty",
          network: childBountyDetail.network,
          parentBountyIndex: childBountyDetail.parentBountyIndex,
          index: childBountyDetail.index,
          title,
          content,
          skills: selectedSkills,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/child-bounty`, payload);
      if (result) {
        notification.success({
          message: "Updated",
        });

        if (isMounted.current) {
          dispatch(
            fetchChildBountyDetail(
              childBountyDetail.network,
              childBountyDetail.parentBountyIndex,
              childBountyDetail.index,
            ),
          );
        }
      }

      if (error) {
        notification.error({
          message: error.message,
        });
      }
    } catch (e) {
      notification.error({
        message: `Failed to update. ${e.message}`,
      });
    } finally {
      closePendingNotification();
      setIsLoading(false);
      onEditEnd();
    }
  };

  if (!childBountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  return (
    <Main>
      <BountyLogo
        network={childBountyDetail?.parentBounty?.network}
        logoUrl={childBountyDetail?.parentBounty?.logoUrl}
      />
      <HeaderText>{childBountyDetail?.parentBounty?.title}</HeaderText>
      <DisabledInputBountyId
        title={"Child bounty ID"}
        tooltip={"The child bounty ID on-chain"}
        bountyId={childBountyDetail?.index}
      />
      <InputTitle title={title} setTitle={setTitle} />
      <BountySkills
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
      />
      <InputDescription content={content} setContent={setContent} />
      <Actions>
        <Button onClick={onEditEnd}>Cancel</Button>
        <Button primary isLoading={isLoading} onClick={onUpdate}>
          Update
        </Button>
      </Actions>
    </Main>
  );
}
