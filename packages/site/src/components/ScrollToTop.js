import { useEffect } from "react";

import { useLocation } from "react-router-dom";

//this is a patch for react-router-dom v6 to implement withRouter()
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    return <Component {...props} router={{ location }} />;
  }

  return ComponentWithRouterProp;
}

function ScrollToTop({ router }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.location.pathname]);

  return null;
}

export default withRouter(ScrollToTop);
