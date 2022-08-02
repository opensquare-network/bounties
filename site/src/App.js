import { HashRouter, Routes, Route } from "react-router-dom";

import { Footer } from "@osn/common-ui/es";

import Layout from "@osn/common-ui/es/styled/Layout";
import Header from "components/Header";
import Main from "@osn/common-ui/es/styled/Main";
import Toast from "components/Toast";
import Home from "pages/Home";
import ImportBounty from "pages/ImportBounty";
import ImportChildBounty from "pages/ImportChildBounty";
import BountyDetail from "pages/BountyDetail";
import ChildBountyDetail from "pages/ChildBountyDetail";
import FourOFour from "pages/404";
import ScrollToTop from "./components/ScrollToTop";
import Notifications from "pages/Notifications";
import NotificationMonitor from "components/NotificationMonitor";

function App() {
  return (
    <HashRouter>
      <Layout>
        <NotificationMonitor />
        <Header />
        <ScrollToTop />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import_bounty" element={<ImportBounty />} />
            <Route
              path="/import_child_bounty"
              element={<ImportChildBounty />}
            />
            <Route
              path="/network/:network/bounty/:bountyId"
              element={<BountyDetail />}
            />
            <Route
              path="/network/:network/bounty/:bountyId/child-bounty/:childBountyId"
              element={<ChildBountyDetail />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<FourOFour />} />
          </Routes>
        </Main>
        <Footer />
        <Toast />
      </Layout>
    </HashRouter>
  );
}

export default App;
