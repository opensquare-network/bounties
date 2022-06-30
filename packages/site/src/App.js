import { HashRouter, Routes, Route } from "react-router-dom";

import { Footer } from "@osn/common-ui/es";

import Layout from "@osn/common-ui/es/styled/Layout";
import Header from "components/Header";
import Main from "@osn/common-ui/es/styled/Main";
import Toast from "components/Toast";
import Home from "pages/Home";
import FourOFour from "pages/404";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Header />
        <ScrollToTop />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
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
