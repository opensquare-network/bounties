import { useNotification } from "@osn/common-ui";

export function useHandleSigningError() {
  const notification = useNotification();

  return (e, message) => {
    if (e.message === "Cancelled") {
      notification.warning({
        message: `Cancelled`,
      });
      return;
    }

    notification.error({
      message: message ? `${message}. ${e.message}` : e.message,
    });
  };
}
