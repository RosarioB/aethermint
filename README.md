# aethermint

## Backend
- Project Set Up: `pnpm i`

- Start in dev mode: `pnpm run dev`

- Start in prod mode: `pnpm run start`

## Eliza
- Project Set Up: `pnpm i && pnpm build`

- Start in dev mode: `pnpm run dev`

- Start in prod mode: `pnpm run start`

## Hardhat
- Project Set Up: `pnpm i`

- Compile: `npx hardhat compile`

- Deploy: `npx hardhat ignition deploy --network baseSepolia ./ignition/modules/Aethermint.ts`

- Execute the script `interact.ts` on Base Sepolia: `npx hardhat run --network baseSepolia ./scripts/interact.ts`