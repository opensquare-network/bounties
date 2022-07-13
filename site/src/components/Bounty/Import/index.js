import styled from "styled-components";

import ConnectWallet from "components/ConnectWallet";
import Input from "@osn/common-ui/es/styled/Input";
import Button from "@osn/common-ui/es/styled/Button";
import { accountSelector } from "store/reducers/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { popUpConnect } from "store/reducers/showConnectSlice";
import { newErrorToast, newSuccessToast } from "store/reducers/toastSlice";
import serverApi from "services/serverApi";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "@osn/common/src/utils/hooks";
import { p_16_semibold } from "@osn/common-ui/es/styles/textStyles";
import BountyMeta from "./BountyMeta";
import BountyLogo from "./BountyLogo";
import RichEditor from "@osn/common-ui/es/RichEditor";
import debounce from "lodash.debounce";
import { ErrorMessage } from "./styled";
import { ASSETS } from "utils/constants";
import { signApiData } from "utils/signature";
import Tooltip from "@osn/common-ui/es/Tooltip";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";

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

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  ${p_16_semibold};
  color: #1e2134;
`;

const InputAndError = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

  const asset = ASSETS.find((item) => item.id === account?.network);

  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const fetchBountyMeta = useMemo(() => {
    return debounce(async (bountyId) => {
      if (!bountyId) {
        setTitle("");
        setValue(0);
        setBountyError("");
        setCurators([]);
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
          if (isMounted.current) {
            setLoading(false);
          }

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
              setTitle("");
              setValue(0);
              setBountyError(error.message);
              setCurators([]);
            }
          }
        });
    }, 300);
  }, [account?.network, isMounted]);

  useEffect(() => {
    setLoaded(false);
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

    setSubmitting(true);
    try {
      const signedData = await signApiData(data, account?.address);

      const formData = new FormData();
      formData.set("data", JSON.stringify(signedData.data));
      formData.set("address", signedData.address);
      formData.set("signature", signedData.signature);
      if (imageFile) {
        formData.set("logo", imageFile);
      }

      const { result, error } = await serverApi.fetch(
        `bounties/import`,
        {},
        {
          method: "POST",
          body: formData,
        }
      );
      setSubmitting(false);

      if (result) {
        dispatch(newSuccessToast("Bounty imported successfully"));
        navigate(`/${account?.network}/bounty/${bountyId}`);
        return;
      }

      if (error) {
        showErrorToast(error.message);
        return;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canImport =
    curators.includes(account?.address) &&
    title &&
    content &&
    loaded &&
    !submitting;

  return (
    <Wrapper>
      <Main>
        <BountyLogo imageFile={imageFile} setImageFile={setImageFile} />
        <Title>
          <span>Bounty ID</span>
          <Tooltip
            content={`The bounty ID on-chain`}
            size="fit"
          >
            <div>
              <FlexCenter>
                <img src="/imgs/icons/question.svg" alt="" />
              </FlexCenter>
            </div>
          </Tooltip>
        </Title>
        <InputAndError>
          <Input
            value={bountyId}
            onChange={(e) => {
              setBountyId(e.target.value);
            }}
            placeholder="0"
            disabled={loading}
          />
          {bountyError && <ErrorMessage>{bountyError}</ErrorMessage>}
        </InputAndError>
        <Title>Title</Title>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Input title here..."
          disabled={loading}
        />
        <Title>Topic</Title>
        <RichEditor
          content={content}
          setContent={setContent}
          disabled={loading}
          showSubmitButton={false}
        />
      </Main>
      <Side>
        {account ? (
          <Box>
            <BountyMeta
              curators={curators}
              symbol={asset?.symbol}
              decimals={asset?.decimals}
              value={value}
            />
            <Button primary block disabled={!canImport} onClick={doImport}>
              Publish
            </Button>
          </Box>
        ) : (
          <Box>
            <ConnectWallet onClick={() => dispatch(popUpConnect())} />
          </Box>
        )}
      </Side>
    </Wrapper>
  );
}
