# Aethermint
A project that integrates a Farcaster webhook to respond to mentions by generating AI-created NFTs with images stored on IPFS, powered by an Eliza agent.

You can invoke Aethermint on Farcaster by casting:

```
@aethermint Send a golden sports car with red stripes to 0x20c6F9006d563240031A1388f4f25726029a6368  

@aethermint Send a golden sports car with red stripes to @rosarioborgesi  

@aethermint Send a golden sports car with red stripes to vitalik.eth
```
## Demo

You can find the demo of this project on [Youtube](https://www.youtube.com/watch?v=iSiw6tYA9B0)

## Docker
Start the MongoDB container:
```
cd /aethermint/docker/test
docker-compose up -d
```

To stop the container:
```
docker-compose down
```

## Backend
- **Project Setup**: `pnpm i`

- **Run Prisma**: `npx prisma generate`

- **Environment Variables**: Create a `.env` file with the following:

    ```
    MONGO_URL=<your-mongo-db-url> (i.e: mongodb://root:root@localhost:27017)
    PRIVATE_KEY=<your-private-key>
    NEYNAR_API_KEY=<your-neynar-api-key>
    SIGNER_UUID=<your-signer-uuid>
    PINATA_GATEWAY_URL=<your-pinata-gateway-url>
    ELIZA_URL=<your-eliza-url>
    ```

- **Start in Development Mode**: `pnpm run dev`

- **Start in Production Mode**: `pnpm run start`

## Eliza Agent
- **Project Setup**: `pnpm i && pnpm build`

- **Environment Variables**: Add the following to the `.env` file:

    ```
    OPENAI_API_KEY=<your-openai-api-key>
    EVM_PRIVATE_KEY=<your-evm-private-key>
    ETHEREUM_PROVIDER_BASESEPOLIA=<your-ethereum-provider-baseseppolia>
    PINATA_JWT=<your-pinata-jwt>
    PINATA_GATEWAY_URL=<your-pinata-gateway-url>
    ERC721_ADDRESS=<your-erc721-address>
    BACKEND_URL=<your-backend-url>
    NEYNAR_API_KEY=<your-neynar-api-key>
    ```

- **Start in Development Mode**: `pnpm run dev`

- **Start in Production Mode**: `pnpm run start`

## Hardhat
- **Project Setup**: `pnpm i`

- **Environment Variables**: Create a `.env` file with the following:

    ```
    PRIVATE_KEY=<your-private-key>
    ACCOUNT_ADDRESS=<your-account-address>
    RPC_URL=<your-rpc-url>
    ```

- **Compile Contracts**: `npx hardhat compile`

- **Deploy Contracts**: `npx hardhat ignition deploy --network baseSepolia ./ignition/modules/Aethermint.ts`

- **Run Interaction Script**: Execute `interact.ts` on Base Sepolia: `npx hardhat run --network baseSepolia ./scripts/interact.ts`