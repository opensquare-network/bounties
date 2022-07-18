import { ActionBar, StyledDescription } from "./styled";
import { Fragment, memo } from "react";
import GoToExtension from "./GotoExtensionButton";

function NoExtension() {
  return (
    <Fragment>
      <StyledDescription>
        Polkadot-js extension not detected. No web3 account could be found.
        Visit this page on a computer with polkadot-js extension.
      </StyledDescription>

      <ActionBar>
        <GoToExtension text="Polkadot{.js} Extension" />
      </ActionBar>
    </Fragment>
  );
}

export default memo(NoExtension);
