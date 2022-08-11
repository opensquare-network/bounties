import styled from "styled-components";
import { MOBILE_SIZE } from "@osn/constants";
import Discussions from "./Discussions";
import ChildBountyDetailApplicants from "./Applicants";
import ChildBountyDetailMeta from "./Meta";
import ChildBountyDetailMetaEdit from "./MetaEdit";
import { useState } from "react";
import { accountSelector } from "store/reducers/accountSlice";
import { useSelector } from "react-redux";

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

export default function ChildBountyDetail({ childBountyDetail }) {
  const account = useSelector(accountSelector);
  const [editing, setEditing] = useState(false);

  return (
    <Wrapper>
      {
        (account && editing) ? (
          <ChildBountyDetailMetaEdit
            type="Child Bounty"
            childBountyDetail={childBountyDetail}
            onEditEnd={() => setEditing(false)}
          />
        ) : (
          <ChildBountyDetailMeta
            type="Child Bounty"
            childBountyDetail={childBountyDetail}
            onEdit={() => setEditing(true)}
          />
        )
      }
      <ChildBountyDetailApplicants childBountyDetail={childBountyDetail} />

      <Discussions
        network={childBountyDetail?.network}
        parentBountyIndex={childBountyDetail?.parentBountyIndex}
        index={childBountyDetail?.index}
      />
    </Wrapper>
  );
}
