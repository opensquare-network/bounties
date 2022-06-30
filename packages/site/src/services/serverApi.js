import Api from "@osn/common/src/services/api";

class ServerApi extends Api {}

export default new ServerApi(process.env.REACT_APP_BOUNTIES_API_SERVER);
