import {
  web3Enable,
  isWeb3Injected,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { PROJECT_NAME } from "@/utils/constants";

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

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

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
    let timeoutId;

    try {
      const signer = await getSigner(account.address);
      const unsub = await tx.signAndSend(
        account.address,
        { signer },
        ({ events = [], status }) => {
          if (status.isInBlock) {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            unsub();

            for (const event of events) {
              const { section, method, data } = event.event;

              if (section === "system" && method === "ExtrinsicFailed") {
                const [dispatchError] = data;
                const message = getDispatchError(dispatchError);
                return reject(new Error(`Extrinsic failed: ${message}`));
              }
            }

            callback("Transaction executed");

            const extrinsicIndex = events[0]?.phase?.value?.toNumber();

            const blockHash = status.asInBlock.toString();
            resolve({
              blockHash,
              extrinsicIndex,
            });
          }
        },
      );

      callback("Transaction broadcasting");

      timeoutId = setTimeout(() => {
        reject(new Error("InBlock message is not received in 30 seconds"));
      }, 30*1000);
    } catch (e) {
      reject(e);
    }
  });
}
