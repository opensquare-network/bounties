import { createFetchIdentity } from "@osn/common";

export const fetchIdentity = createFetchIdentity(import.meta.env.VITE_APP_IDENTITY_SERVER_HOST)
