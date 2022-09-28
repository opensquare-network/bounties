# server

Server package hosts RESTful apis for fronted to import/update bounties/child bounties and support collaborations between bounty curators and bounty hunters. Check [features](./src/features) to see the apis.

## Dependencies

- [Infura](https://infura.io/). We will upload related IPFS data to infura, so please make sure to register an infura account and create a IPFS project.
- Multisig api for substrate chains. In most case bounty curator is a multisig address, and we need an api to get all the signatories of this multisig address to decide who can import bounties.
  We can use https://multisig-api.opensquare.io as the default one. 

## How to run

1. `yarn install`
2. `cat .env.example > .env`, change the environment variables by your needs.
3. `node src/index.js`

## Environment variables
```dotenv
# mongoDB uri
MONGODB_URI=mongodb://localhost:27017/bounties
# node api url
NODE_API_ENDPOINT=http://localhost:3223
# the multisig api url
MULTISIG_API_ENDPOINT=http://localhost:4701

# server port
PORT=5050

# the infura IPFS project id and secret
INFURA_PROJECT_ID=
INFURA_PROJECT_SECRET=
# Set `USE_LOCAL_IPFS_NODE` to be true if you have a IPFS endpoint by yourself
LOCAL_IPFS_NODE_URL=http://localhost:5001
USE_LOCAL_IPFS_NODE=false

# the IPFS gateway to get data on IPFS
IPFS_GATEWAY_URL=https://opensquare.infura-ipfs.io/ipfs/

# Only for test, TEST_ACCOUNTS will be the curators on test environment
TEST_ACCOUNTS=xxx|yyy
```
