import { useAccount } from "hooks/useAccount";
import { useState } from "react";
import { useAsyncState } from "@osn/common";
import { signApiData } from "utils/signature";
import serverApi from "services/serverApi";
import { Button, noop, notification, RichEditor } from "@osn/common-ui";
import InputTitle from "components/Common/Import/InputTitle";
import InputDescription from "components/Common/Import/InputDescription";
import { Main } from "components/Bounty/Import/styled";
import InputBountyId from "components/Common/Import/InputBountyId";
import BountyLogo from "components/Bounty/Import/BountyLogo";
import { useFetchBountyDetail } from "hooks/useFetchBountyDetail";
import { useDispatch } from "react-redux";

export default function BountyMetaEdit({ bountyDetail, onEditEnd = noop }) {
  const account = useAccount();
  const { fetchBountyDetail } = useFetchBountyDetail();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(bountyDetail.title);
  const [content, setContent] = useState(bountyDetail.content);
  const [imageFile, setImageFile] = useState();

  const { isLoading, execute } = useAsyncState(
    async () => {
      const data = {
        action: "editBounty",
        network: account?.network,
        bountyIndex: bountyDetail?.bountyIndex,
        title,
        content,
      };

      const signedData = await signApiData(data, account?.encodedAddress);

      const formData = new FormData();
      formData.set("data", JSON.stringify(signedData.data));
      formData.set("address", signedData.address);
      formData.set("signature", signedData.signature);
      if (imageFile) {
        formData.set("logo", imageFile);
      }

      try {
        const { result, error } = await serverApi.fetch(
          "/bounty",
          {},
          {
            method: "PATCH",
            body: formData,
          },
        );

        if (error) {
          return Promise.reject(error);
        }

        dispatch(fetchBountyDetail());
        onEditEnd();
        return result;
      } catch {}
    },
    {},
    {
      immediate: false,
      onError(e) {
        notification.error({ message: e.message });
      },
    },
  );

  return (
    <Main>
      <BountyLogo
        imageFile={bountyDetail?.logoUrl || imageFile}
        setImageFile={setImageFile}
        network={account?.network}
      />

      <InputBountyId
        title={"Bounty ID"}
        tooltip={"The bounty ID on-chain"}
        bountyId={bountyDetail?.bountyIndex}
        disabled
      />

      <InputTitle title={title} setTitle={setTitle} isLoading={isLoading} />

      <InputDescription
        content={content}
        setContent={setContent}
        onSubmit={execute}
        showSubmitButton
        submitButtonText="Update"
        extraButtons={<Button onClick={onEditEnd}>Cancel</Button>}
      />
    </Main>
  );
}
