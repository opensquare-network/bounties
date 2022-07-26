import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import serverApi from "services/serverApi";
import BountyLogo from "components/Bounty/BountyLogo";
import styled from "styled-components";
import { newErrorToast } from "store/reducers/toastSlice";

const HeaderText = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  color: #1e2134;
`;

export default function BountyHeader({ network, bountyIndex }) {
  const dispatch = useDispatch();
  const [bountyDetail, setBountyDetail] = useState();

  useEffect(() => {
    serverApi
      .fetch(`/network/${network}/bounties/${bountyIndex}`)
      .then(({ result, error }) => {
        if (result) {
          setBountyDetail(result);
        }
        if (error) {
          dispatch(newErrorToast(error.message));
        }
      });
  }, [dispatch, network, bountyIndex]);

  return (
    <>
      <BountyLogo network={network} logoUrl={bountyDetail?.logoUrl} />
      <HeaderText>{bountyDetail?.title}</HeaderText>
    </>
  );
}
