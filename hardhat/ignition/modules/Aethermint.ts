// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const owner = process.env.ACCOUNT_ADDRESS!;

const AethermintModule = buildModule("AethermintModule", (m) => {
  const aethermint = m.contract("Aethermint", [owner], {});
  return { aethermint };
});

export default AethermintModule;
