import styled from "styled-components";

import Meta from "./Meta";
import Discussions from "./Discussions";
import { MOBILE_SIZE } from "@osn/constants";
import ChildBounties from "./ChildBounties";
import { useState } from "react";
import BountyMetaEdit from "./MetaEdit";
import { useDifferentNetworkNotice } from "hooks/useDifferentNetworkNotice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    flex-wrap: wrap;
  }

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    margin: 0 -16px;
  }

  gap: 20px;
`;

export default function BountyDetail({ bountyDetail }) {
  const [editing, setEditing] = useState(false);
  const { noticeEl, isDifferentNetwork, isCurator } = useDifferentNetworkNotice(
    bountyDetail?.network,
    bountyDetail?.bounty?.curators,
  );

  return (
    <Wrapper>
      {bountyDetail && isDifferentNetwork && isCurator && noticeEl}

      {editing ? (
        <BountyMetaEdit
          bountyDetail={bountyDetail}
          onEditEnd={() => setEditing(false)}
        />
      ) : (
        <Meta
          type="Bounty"
          bountyDetail={bountyDetail}
          onEdit={() => setEditing(true)}
        />
      )}
      <ChildBounties bountyDetail={bountyDetail} />
      <Discussions
        network={bountyDetail?.network}
        bountyId={bountyDetail?.bountyIndex}
      />
    </Wrapper>
  );
}
