import {
  web3Enable,
  isWeb3Injected,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { PROJECT_NAME } from "./constants";

export const signMessage = async (text, address) => {
  await web3Enable(PROJECT_NAME);

  if (!isWeb3Injected) {
    throw new Error("Polkadot Extension is not installed");
  }

  if (!address) {
    throw new Error("Sign addres is missing");
  }

  const injector = await web3FromAddress(address);

  const data = stringToHex(text);
  const result = await injector.signer.signRaw({
    type: "bytes",
    data,
    address,
  });

  return result.signature;
};

export const signApiData = async (data, address) => {
  const dataToSign = {
    ...data,
    timestamp: parseInt(Date.now() / 1000),
  };
  const msg = JSON.stringify(dataToSign);
  const signature = await signMessage(msg, address);

  return {
    data: dataToSign,
    address,
    signature,
  };
};
