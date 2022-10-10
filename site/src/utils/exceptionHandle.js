import { notification } from "@osn/common-ui";

export function handleSigningError(e, message) {
  if (e.message === "Cancelled") {
    notification.warning({
      message: `Cancelled`,
    });
    return;
  }

  notification.error({
    message: message ? `${message}. ${e.message}` : e.message,
  });

}
