import styled from "styled-components";

import ConnectWallet from "components/ConnectWallet";
import Button from "@osn/common-ui/es/styled/Button";
import { accountSelector } from "store/reducers/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "store/reducers/toastSlice";
import serverApi from "services/serverApi";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "@osn/common/src/utils/hooks";
import BountyLogo from "./BountyLogo";
import debounce from "lodash.debounce";
import { ASSETS } from "utils/constants";
import { signApiData } from "utils/signature";
import { encodeNetworkAddress } from "@osn/common/src";
import InputTitle from "components/Common/Import/InputTitle";
import InputDescription from "components/Common/Import/InputDescription";
import InputBountyId from "components/Common/Import/InputBountyId";
import BountyMeta from "components/Common/Import/BountyMeta";
import { resolveBountyDetailRoute } from "utils/route";

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

export default function ImportBounty() {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [title, setTitle] = useState("");
  const [bountyId, setBountyId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [bountyError, setBountyError] = useState("");
  const [curators, setCurators] = useState([]);
  const [value, setValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [connectWalletModalVisible, setConnectWalletModalVisible] =
    useState(false);

  const asset = ASSETS.find((item) => item.id === account?.network);
  const encodedAddress =
    account?.address &&
    encodeNetworkAddress(account?.address, account?.network);

  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const fetchBountyMeta = useMemo(() => {
    return debounce(async (bountyId) => {
      if (!bountyId) {
        return;
      }

      if (!bountyId.match(/^\d+$/)) {
        setBountyError("Please input a valid bounty ID");
        return;
      }

      setLoading(true);
      serverApi
        .fetch(`chain/${account?.network}/bounty/${bountyId}`)
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
  }, [account?.network, isMounted]);

  useEffect(() => {
    setLoaded(false);
    setTitle("");
    setValue(0);
    setBountyError("");
    setCurators([]);

    fetchBountyMeta(bountyId);
  }, [fetchBountyMeta, bountyId]);

  const doImport = async () => {
    if (!bountyId) {
      showErrorToast("Bounty ID is required");
      return;
    }

    if (!title) {
      showErrorToast("Title is required");
      return;
    }

    if (!content) {
      showErrorToast("Content is required");
      return;
    }

    const data = {
      action: "importBounty",
      network: account?.network,
      bountyIndex: bountyId,
      title,
      content,
    };

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    setSubmitting(true);
    try {
      const signedData = await signApiData(data, encodedAddress);

      dispatch(updatePendingToast(toastId, "Importing..."));

      const formData = new FormData();
      formData.set("data", JSON.stringify(signedData.data));
      formData.set("address", signedData.address);
      formData.set("signature", signedData.signature);
      if (imageFile) {
        formData.set("logo", imageFile);
      }

      const { result, error } = await serverApi.fetch(
        `bounties`,
        {},
        {
          method: "POST",
          body: formData,
        },
      );
      setSubmitting(false);

      if (result) {
        dispatch(newSuccessToast("Bounty imported"));
        navigate(resolveBountyDetailRoute(account?.network, bountyId));
        return;
      }

      if (error) {
        showErrorToast(error.message);
        return;
      }
    } finally {
      dispatch(removeToast(toastId));
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
        <BountyLogo
          imageFile={imageFile}
          setImageFile={setImageFile}
          network={account?.network}
        />
        <InputBountyId
          title={"Bounty ID"}
          tooltip={"The bounty ID on-chain"}
          bountyId={bountyId}
          setBountyId={setBountyId}
          errorMsg={bountyError}
        />
        <InputTitle title={title} setTitle={setTitle} isLoading={loading} />
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
              network={account?.network}
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
