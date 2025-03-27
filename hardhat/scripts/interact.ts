import hre from 'hardhat';

const CONTRACT_ADDRESS = '0x16856e7017E2291dF01e00ca02C349C2338Ec534';
const OWNER_ACCOUNT= "0x20c6F9006d563240031A1388f4f25726029a6368";  

async function main() {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Get the first signer
  const [signer] = await hre.ethers.getSigners();

  // Get the contract factory and deploy
  const Aethermint = await hre.ethers.getContractFactory('Aethermint');
  const aethermintContract = await Aethermint.connect(signer).attach(CONTRACT_ADDRESS);

  // Run contract read function
  const totalSupply = await aethermintContract.totalSupply();
  console.log(`The total supply of tokens is: ${totalSupply}`);

  const balance = await aethermintContract.balanceOf(OWNER_ACCOUNT);
  console.log(`The token balance of the account ${OWNER_ACCOUNT} is: ${balance}`);

  const tokenId = 6;
  const tokenURI = await aethermintContract.tokenURI(tokenId);
  console.log(`The token URI of the tokenId ${tokenId} is: ${tokenURI}`);

  /* // Run contract write function
  const transaction = await aethermintContract.setGreeting('Hello people!');
  console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

  // Read message after transaction
  console.log(`The message now is: ${await aethermintContract.greet()}`); */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

