import Api from "@osn/common/es/services/api";

class ServerApi extends Api {}

const serverApi = new ServerApi(import.meta.env.VITE_APP_BOUNTIES_API_SERVER);

export default serverApi;
