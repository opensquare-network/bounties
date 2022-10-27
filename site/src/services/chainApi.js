import {
  web3Enable,
  isWeb3Injected,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { PROJECT_NAME } from "utils/constants";

export const signMessage = async (text, address) => {
  if (!isWeb3Injected) {
    throw new Error("Polkadot Extension is not installed");
  }

  if (!address) {
    throw new Error("Sign addres is missing");
  }

  const signer = await getSigner(address);

  const data = stringToHex(text);
  const result = await signer.signRaw({
    type: "bytes",
    data,
    address,
  });

  return result.signature;
};

export const getSigner = async (signerAddress) => {
  await web3Enable(PROJECT_NAME);
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
};

export async function awardChildBounty(
  api,
  parentBountyIndex,
  index,
  beneficiary,
  account,
  callback,
) {
  const tx = api.tx.childBounties.awardChildBounty(
    parentBountyIndex,
    index,
    beneficiary,
  );

  await signAndSendTx(
    tx,
    account,
    callback,
  );
}

function signAndSendTx(tx, account, callback = () => {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const signer = await getSigner(account.address);
      const unsub = await tx.signAndSend(
        account.address,
        { signer },
        ({ events = [], status }) => {
          if (status.isInBlock) {
            unsub();

            for (const {
              event: { method, section },
            } of events) {
              if (section === "system" && method === "ExtrinsicFailed") {
                return reject(new Error("Extrinsic failed"));
              }
            }

            callback("Transaction executed");

            const extrinsicIndex = JSON.parse(
              events[0]?.phase?.toString(),
            )?.applyExtrinsic;

            const blockHash = status.asInBlock.toString();
            resolve({
              blockHash,
              extrinsicIndex,
            });
          }
        },
      );

      callback("Transaction broadcasting");
    } catch (e) {
      reject(e);
    }
  });
}
