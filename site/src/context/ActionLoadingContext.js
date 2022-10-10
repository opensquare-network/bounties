import React, { useContext, useState } from "react";

const ActionLoadingContext = React.createContext();

function ActionLoadingProvider({ children }) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  return (
    <ActionLoadingContext.Provider value={{ isActionLoading, setIsActionLoading }}>
      {children}
    </ActionLoadingContext.Provider>
  )
}

function useIsActionLoading() {
  const { isActionLoading } = useContext(ActionLoadingContext);
  return isActionLoading;
}

function useSetIsActionLoading() {
  const { setIsActionLoading } = useContext(ActionLoadingContext);
  return setIsActionLoading;
}

export {
  ActionLoadingContext,
  ActionLoadingProvider,
  useIsActionLoading,
  useSetIsActionLoading,
};
