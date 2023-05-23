import { ethers } from "hardhat";

/**
 * main method
 */
async function main() {
  const Registry = await ethers.getContractFactory("SampleAccountRegistry");
  const registry = await Registry.deploy();

  await registry.deployed();

  console.log(` ======= deployed to ${registry.address} =======`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
