import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  Dot,
  List,
  Collapse,
  LoadingIcon,
  notification,
  noop,
} from "@osn/common-ui";
import Item from "components/Discussion/Item";
import Pagination from "@osn/common-ui/es/styled/Pagination";
import { accountSelector } from "store/reducers/accountSlice";
import serverApi from "services/serverApi";
import RichEditor from "@osn/common-ui/es/RichEditor";
import { signMessage } from "utils/signature";
import {
  discussionsSelector,
  fetchChildBountyDiscussions,
  setDiscussions,
} from "store/reducers/discussionSlice";
import {
  addressEllipsis,
  encodeNetworkAddress,
} from "@osn/common/es/utils/address";
import { fetchIdentity } from "@osn/common/es/services/identity";
import uniqWith from "lodash.uniqwith";
import { useIsMounted } from "@osn/common/es/utils/hooks";
import { p_16_semibold } from "@osn/common-ui/es/styles/textStyles";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import { useSearchParams } from "react-router-dom";
import { identityChainMap } from "@osn/constants";
import NetworkUser from "components/User/NetworkUser";
import { MentionIdentityUser } from "@osn/common-ui";
import { useBountyPermission } from "hooks/useBountyPermission";

const Title = styled.div`
  ${p_16_semibold};
`;

const PaginationWrapper = styled.div`
  margin: 20px 0;
`;

const EditorWrapper = styled.div``;

const Count = styled.span`
  color: #a1a8b3;
`;

const LoadingWrapper = styled(FlexCenter)`
  height: 104px;
`;

export default function Discussion({ network, parentBountyIndex, index }) {
  const editorRef = useRef();
  const dispatch = useDispatch();
  const discussions = useSelector(discussionsSelector);

  const account = useSelector(accountSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const setPage = (page) => {
    setSearchParams({ page });
  };
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();
  const [suggestions, setSuggestions] = useState([]);
  const { canComment } = useBountyPermission({ network });

  const resolveMentionFormat = (identity, user) =>
    `[@${identity?.info?.display || addressEllipsis(user.address)}](${
      user.address
    }-${user.network}) `;

  useEffect(() => {
    if (network && parentBountyIndex !== undefined && index !== undefined) {
      dispatch(
        fetchChildBountyDiscussions(network, parentBountyIndex, index, page),
      );
    }
    return () => {
      dispatch(setDiscussions(null));
    };
  }, [dispatch, network, parentBountyIndex, index, page]);

  const onSubmit = async () => {
    if (!account) {
      notification.error({
        message: "Please connect wallet",
      });
      return;
    }

    if (!content) {
      notification.error({
        message: "Content is empty",
      });
      return;
    }

    const data = {
      action: "comment",
      type: "childBounty",
      network,
      parentBountyIndex,
      index,
      content,
      commenterNetwork: account.network,
    };
    const msg = JSON.stringify(data);

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
      timeout: false,
    });

    try {
      setLoading(true);

      const signature = await signMessage(msg, account.address);
      const payload = {
        data,
        address: encodeNetworkAddress(account.address, account.network),
        signature,
      };

      const { result, error } = await serverApi.post(`/comments`, payload);
      if (result) {
        setContent("");
        notification.success({
          message: "Comment posted",
        });
        dispatch(
          fetchChildBountyDiscussions(network, parentBountyIndex, index, page),
        );
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
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const fetchIdentitySuggestions = useCallback(async () => {
    const userIdentities = await Promise.all(
      uniqWith(
        discussions?.items || [],
        (a, b) =>
          a.address === b.address && a.commenterNetwork === b.commenterNetwork,
      )
        .map((item) => ({
          address: encodeNetworkAddress(item.address, item.commenterNetwork),
          network: item.commenterNetwork,
        }))
        .map(async (item) => {
          const identityChain = identityChainMap[item.network] || item.network;
          const identity = await fetchIdentity(identityChain, item.address);
          return {
            ...item,
            identity,
          };
        }),
    );

    return userIdentities.map((user) => {
      return {
        address: user.address,
        value: resolveMentionFormat(user.identity, user),
        preview: (
          <NetworkUser noLink address={user.address} network={user.network} />
        ),
      };
    });
  }, [discussions]);

  useEffect(() => {
    fetchIdentitySuggestions().then((v) => {
      setSuggestions(v);
    });
  }, [discussions, fetchIdentitySuggestions]);

  const loadSuggestions = (text) => {
    return suggestions.filter((i) =>
      i.address.toLowerCase().includes(text.toLowerCase()),
    );
  };

  const forceEditor = () => {
    editorRef.current?.querySelector("textarea")?.focus();
    editorRef.current?.scrollIntoView();
  };

  const onReply = async (user) => {
    const identityChain = identityChainMap[user.network] || user.network;
    const identity = fetchIdentity(identityChain, user.address);
    const mention = resolveMentionFormat(identity, user);

    setContent(content + mention + " ");

    forceEditor();
  };

  const title = (
    <>
      <Title>
        Discussions
        {typeof discussions?.total === "number" && (
          <>
            <Dot />
            <Count>{discussions?.total}</Count>
          </>
        )}
      </Title>
    </>
  );

  return (
    <Collapse title={title}>
      <List
        gap={20}
        data={discussions?.items}
        loading={!discussions}
        loadingComponent={
          <LoadingWrapper>
            <LoadingIcon />
          </LoadingWrapper>
        }
        noDataMessage="No current discussions"
        noDataProps={{
          bordered: false,
          shadow: false,
        }}
        itemRender={(comment, index) => (
          <List.Item>
            <Item
              height={
                (discussions?.page - 1) * discussions?.pageSize + index + 1
              }
              comment={comment}
              onReply={onReply}
            />
          </List.Item>
        )}
      />

      <PaginationWrapper>
        <Pagination
          className="pagination"
          page={discussions?.page}
          pageSize={discussions?.pageSize}
          total={discussions?.total}
          setPage={setPage}
        />
      </PaginationWrapper>
      {!(discussions === null) && canComment && (
        <EditorWrapper>
          <RichEditor
            ref={editorRef}
            content={content}
            setContent={setContent}
            onSubmit={onSubmit}
            showButtons={true}
            submitButtonName="Comment"
            submitting={loading}
            loadSuggestions={loadSuggestions}
            identifier={<MentionIdentityUser hashRoute target="_blank" />}
          />
        </EditorWrapper>
      )}
    </Collapse>
  );
}
