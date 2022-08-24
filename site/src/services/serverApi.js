import Api from "@osn/common/es/services/api";

class ServerApi extends Api {}

export default new ServerApi(process.env.REACT_APP_BOUNTIES_API_SERVER);
