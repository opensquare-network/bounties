import { useRef, useState } from "react";
import styled from "styled-components";
import { Title } from "@/components/Common/Import/styled";

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

export default function BountyLogo({ network, imageFile, setImageFile }) {
  const inputEl = useRef();
  const [imageDataUrl, setImageDataUrl] = useState(imageFile);

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

  const defaultLogoUrl =
    network === "kusama"
      ? "/imgs/icons/bounty-logo-kusama.svg"
      : "/imgs/icons/bounty-logo-polkadot.svg";

  return (
    <>
      <Title>Logo</Title>
      <LogoContainer>
        {!inputEl.current?.vaule && (
          <img className="logo" src={defaultLogoUrl} />
        )}
        <Layer style={{ opacity: imageDataUrl ? 1 : 0 }}>
          <img className="logo" src={imageDataUrl} alt="" />
        </Layer>
        <Layer className="upload" onClick={handleSelectFile}>
          <img src="/imgs/icons/logo-upload.svg" />
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
