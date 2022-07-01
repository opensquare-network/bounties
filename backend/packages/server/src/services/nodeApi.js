const { HttpError } = require("../utils/exc");

class NodeApi {
  endpoint = null;

  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  fetch = async (path, params = {}, options) => {
    const url = new URL(path, this.endpoint);
    for (const key of Object.keys(params)) {
      url.searchParams.set(key, params[key]);
    }
    const resp = await fetch(url, options);
    const data = await resp.json();
    if (!resp.ok) {
      throw new HttpError(resp.status, data.message);
    }
    return data;
  };

  get = async (path) => {
    return await this.fetch(path);
  };

  post = async (path, body = null, options = null) => {
    const result = await this.fetch(
      path,
      {},
      {
        method: "POST",
        body: body ? JSON.stringify(body) : null,
        headers: { "Content-Type": "application/json" },
        ...options,
      }
    );
    return result;
  };
}

module.exports = NodeApi;
