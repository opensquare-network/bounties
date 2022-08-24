import styled from "styled-components";

import ConnectWallet from "components/ConnectWallet";
import Button from "@osn/common-ui/es/styled/Button";
import { accountSelector } from "store/reducers/accountSlice";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import serverApi from "services/serverApi";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "@osn/common/es/utils/hooks";
import debounce from "lodash.debounce";
import { ASSETS } from "utils/constants";
import { signApiData } from "utils/signature";
import { encodeNetworkAddress } from "@osn/common/es";
import InputTitle from "components/Common/Import/InputTitle";
import InputDescription from "components/Common/Import/InputDescription";
import InputBountyId from "components/Common/Import/InputBountyId";
import BountyMeta from "components/Common/Import/BountyMeta";
import BountySkills from "./BountySkills";
import BountyHeader from "./BountyHeader";
import { resolveChildBountyDetailRoute } from "utils/route";
import { noop, notification } from "@osn/common-ui";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }

  > :first-child {
    flex-grow: 1;

    > :not(:first-child) {
      margin-top: 20px;
    }
  }

  > :nth-child(2) {
    flex: 0 0 300px;
    @media screen and (min-width: 901px) {
      margin-left: 20px;
    }
    @media screen and (max-width: 900px) {
      margin-top: 20px;
    }
  }
`;

const Box = styled.div`
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.04),
    0px 0.751293px 3.88168px rgba(26, 33, 44, 0.03);
  border: 1px solid #f0f3f8;
  padding: 32px;
  background-color: white;
  @media screen and (max-width: 900px) {
    padding: 16px;
    margin: 0 -16px;
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

const Side = styled.div`
  button {
    box-sizing: border-box;
  }
`;

export default function ImportChildBounty({ network, parentBountyId }) {
  const account = useSelector(accountSelector);
  const [title, setTitle] = useState("");
  const [childBountyId, setChildBountyId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bountyError, setBountyError] = useState("");
  const [curators, setCurators] = useState([]);
  const [value, setValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [connectWalletModalVisible, setConnectWalletModalVisible] =
    useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const asset = ASSETS.find((item) => item.id === network);
  const encodedAddress =
    account?.address && encodeNetworkAddress(account?.address, network);

  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const fetchChildBountyMeta = useMemo(() => {
    return debounce(async (parentBountyId, index) => {
      if (!index) {
        return;
      }

      if (!index.match(/^\d+$/)) {
        setBountyError("Please input a valid child bounty ID");
        return;
      }

      if (!parentBountyId || !parentBountyId.match(/^\d+$/)) {
        setBountyError("Invalid parent bounty ID");
        return;
      }

      setLoading(true);
      serverApi
        .fetch(`chain/${network}/child-bounty/${parentBountyId}_${index}`)
        .then(({ result, error }) => {
          if (result) {
            if (isMounted.current) {
              setTitle(result.description);
              setCurators(result.curators);
              setValue(result.value);
              setBountyError("");
              setLoaded(true);
            }
          }
          if (error) {
            if (isMounted.current) {
              setBountyError(error.message);
            }
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoading(false);
          }
        });
    }, 1000);
  }, [network, isMounted]);

  useEffect(() => {
    setLoaded(false);
    setTitle("");
    setValue(0);
    setBountyError("");
    setCurators([]);

    fetchChildBountyMeta(parentBountyId, childBountyId);
  }, [fetchChildBountyMeta, parentBountyId, childBountyId]);

  const doImport = async () => {
    if (!parentBountyId) {
      notification.error({
        message: "Parent bounty ID is required",
      });
      return;
    }

    if (!childBountyId) {
      notification.error({
        message: "Child bounty ID is required",
      });
      return;
    }

    if (!title) {
      notification.error({
        message: "Title is required",
      });
      return;
    }

    if (!content) {
      notification.error({
        message: "Content is required",
      });
      return;
    }

    const data = {
      action: "importChildBounty",
      network,
      parentBountyIndex: parentBountyId,
      index: childBountyId,
      title,
      content,
      skills: selectedSkills,
    };

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
    });

    setSubmitting(true);
    try {
      const signedData = await signApiData(data, encodedAddress);

      const { result, error } = await serverApi.fetch(
        `child-bounties`,
        {},
        {
          method: "POST",
          body: JSON.stringify(signedData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setSubmitting(false);

      if (result) {
        notification.success({
          message: "Child bounty imported",
        });
        navigate(
          resolveChildBountyDetailRoute(network, parentBountyId, childBountyId),
        );
        return;
      }

      if (error) {
        notification.error({
          message: error.message,
        });
        return;
      }
    } finally {
      closePendingNotification();
      if (isMounted.current) {
        setSubmitting(false);
      }
    }
  };

  const isCurator = encodedAddress && curators.includes(encodedAddress);

  const canImport = isCurator && title && content && loaded && !submitting;

  return (
    <Wrapper>
      <Main>
        <BountyHeader network={network} bountyIndex={parentBountyId} />
        <InputBountyId
          title={"Child bounty ID"}
          tooltip={"The child bounty ID on-chain"}
          bountyId={childBountyId}
          setBountyId={setChildBountyId}
          isLoading={loading}
          errorMsg={bountyError}
        />
        <InputTitle title={title} setTitle={setTitle} isLoading={loading} />
        <BountySkills
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
        />
        <InputDescription
          content={content}
          setContent={setContent}
          isLoading={loading}
        />
      </Main>
      <Side>
        {account ? (
          <Box>
            <BountyMeta
              network={network}
              curators={curators}
              symbol={asset?.symbol}
              decimals={asset?.decimals}
              value={value}
              loading={loading}
            />
            <Button primary block disabled={!canImport} onClick={doImport}>
              Publish
            </Button>
          </Box>
        ) : (
          <Box>
            <ConnectWallet
              visible={connectWalletModalVisible}
              setVisible={setConnectWalletModalVisible}
            />
          </Box>
        )}
      </Side>
    </Wrapper>
  );
}
