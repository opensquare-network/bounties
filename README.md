# Bounties

OpenSquare bounties is a bounties' aggregation platform for [substrate](https://github.com/paritytech/substrate) based
chains. The bounty and child bounty curators' can import the bounty and child bounties, and bounty hunters can apply the
child bounties. Following collaboration workflows like assignment, submission, etc will be supported.

## Packages

The code contains [backend](./backend) and [site](./site) parts. The backend has 2 packages:
- [node-api](./backend/packages/node-api) which provides apis to query on chain data.
- [server](./backend/packages/server) which provide restful apis for fronted pages.

The [site](./site) directory contains the code for fronted pages.
