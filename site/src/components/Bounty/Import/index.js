import ConnectWallet from "components/ConnectWallet";
import Button from "@osn/common-ui/es/styled/Button";
import { accountSelector } from "store/reducers/accountSlice";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import serverApi from "services/serverApi";
import { useNavigate } from "react-router-dom";
import { useIsMounted, encodeNetworkAddress } from "@osn/common";
import BountyLogo from "./BountyLogo";
import debounce from "lodash.debounce";
import { ASSETS } from "utils/constants";
import { signApiData } from "utils/signature";
import InputTitle from "components/Common/Import/InputTitle";
import InputDescription from "components/Common/Import/InputDescription";
import InputBountyId from "components/Common/Import/InputBountyId";
import BountyMeta from "components/Common/Import/BountyMeta";
import { resolveBountyDetailRoute } from "utils/route";
import { Wrapper, Box, Main, Side } from "./styled";
import { noop, notification } from "@osn/common-ui";

export default function ImportBounty() {
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
      notification.error({
        message: "Bounty ID is required",
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
      action: "importBounty",
      network: account?.network,
      bountyIndex: bountyId,
      title,
      content,
    };

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
    });

    setSubmitting(true);
    try {
      const signedData = await signApiData(data, encodedAddress);

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
        notification.success({
          message: "Bounty imported",
        });
        navigate(resolveBountyDetailRoute(account?.network, bountyId));
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
          isLoading={loading}
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
