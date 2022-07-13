import styled from "styled-components";
import { p_16_semibold } from "@osn/common-ui/es/styles/textStyles";
import { ReactComponent as KusamaLogoIcon } from "imgs/icons/bounty-logo-kusama.svg";
import { ReactComponent as PolkadotLogoIcon } from "imgs/icons/bounty-logo-polkadot.svg";
import { ReactComponent as UploadLogoIcon } from "imgs/icons/logo-upload.svg";
import { useRef, useState } from "react";

const Title = styled.div`
  ${p_16_semibold};
  color: #1e2134;
`;

const LogoContainer = styled.div`
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border: 1px solid #d2d9e2;
  border-radius: 50%;
  background: #f0f3f8;
  overflow: hidden;

  div.upload {
    display: none;
  }
  :hover {
    > div.upload {
      display: inline-flex;
    }
  }

  img.logo {
    width: 100%;
    height: 100%;
  }
`;

const Layer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  border-radius: 50%;
`;

const Info = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #a1a8b3;
`;

export default function BountyLogo({ network, setImageFile }) {
  const inputEl = useRef();
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const handleSelectFile = () => {
    inputEl.current.vaule = "";
    inputEl.current?.click();
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  };

  const uploadImage = (files) => {
    if (files && files.length) {
      const image = files[0];
      if (!/image\/\w+/.exec(image.type)) {
        return;
      }

      if (FileReader && files && files.length) {
        const image = files[0];
        if (!/image\/\w+/.exec(image.type)) {
          return;
        }

        setImageFile(image);

        var fr = new FileReader();
        fr.onload = function () {
          setImageDataUrl(fr.result);
        };
        fr.readAsDataURL(image);
      }
    }
  };

  const defaultLogo = network === "kusama" ? <KusamaLogoIcon /> : <PolkadotLogoIcon />;

  return (
    <>
      <Title>Logo</Title>
      <LogoContainer>
        {!inputEl.current?.vaule && defaultLogo}
        <Layer style={{ opacity: imageDataUrl ? 1 : 0 }}>
          <img className="logo" src={imageDataUrl} alt="" />
        </Layer>
        <Layer className="upload" onClick={handleSelectFile}>
          <UploadLogoIcon />
        </Layer>
      </LogoContainer>
      <Info>Recommended size: 200x200px</Info>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputEl}
        accept="image/*"
        onChange={onSelectFile}
      />
    </>
  );
}
