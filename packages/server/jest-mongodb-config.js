module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "jest"
    },
    binary: {
      version: "5.0.5", // Version of MongoDB
      skipMD5: true
    },
    replSet: {
      count: 1,
      storageEngine: "wiredTiger",
    },
    autoStart: false,
  },
  mongoURLEnvName: "MONGODB_URI",
};
