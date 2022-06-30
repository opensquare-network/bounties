import Flex from "@osn/common-ui/es/styled/Flex";
import styled from "styled-components";
import {
  p_12_normal,
  p_16_semibold,
  p_18_semibold,
} from "@osn/common-ui/es/styles/textStyles";

const AppWrapper = styled(Flex)`
  ${p_18_semibold};
  height: 40px;
  cursor: pointer;
  .color {
    display: none;
  }
  div.products {
    display: none;
  }
  &:hover {
    .monochrome {
      display: none;
    }
    div.products,
    .color {
      display: initial;
    }
  }

  > img {
    width: 24px;
    margin-right: 8px;
  }
`;

const Products = styled.div`
  position: absolute;
  top: 60px;
  z-index: 1;
  padding: 16px 16px 0 16px;
  width: 360px;
  background: white;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
`;

const Product = styled.a`
  margin-bottom: 16px;
  display: flex;
  align-items: start;
  gap: 16px;
  min-height: 42px;
  color: #506176;
  &:hover {
    color: #1e2134;
    p {
      ::before {
        background-image: url("/imgs/icons/caret-right-dark.svg");
      }
    }
  }
  p {
    all: unset;
    width: 100%;
    ${p_16_semibold};
    ::before {
      content: "";
      background-image: url("/imgs/icons/caret-right.svg");
      float: right;
      height: 24px;
      width: 24px;
    }
  }
  div {
    flex-grow: 1;
    flex-wrap: wrap;
  }
  span {
    ${p_12_normal};
    color: #a1a8b3;
  }
`;

function ProductSwitch() {
  return (
    <AppWrapper>
      <img className="monochrome" src="/imgs/icons/apps.svg" alt="" />
      <img className="color" src="/imgs/icons/apps-color.svg" alt="" />
      Bounties
      <Products className="products">
        <Product href="https://voting.opensquare.io/">
          <img src="/imgs/icons/voting.svg" width={24} alt="" />
          <Flex>
            <p>Off-chain Voting</p>
            <span>Multi-chain assets off-chain voting platform</span>
          </Flex>
        </Product>
        <Product href="/">
          <img src="/imgs/icons/qa.svg" width={24} alt="" />
          <Flex>
            <p>Bounties</p>
            <span>Decentralized bounties platform</span>
          </Flex>
        </Product>
      </Products>
    </AppWrapper>
  );
}

export default ProductSwitch;
