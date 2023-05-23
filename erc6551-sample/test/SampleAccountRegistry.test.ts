import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC6551 Sample test", function () {

  // implementation address (ERC4337's SampleAccont address (Mumbai))
  const IMPL_ADDRESS = "0x0923945731C2aD0279aCA441F438AE86AE1dF072";
  const CHAIN_ID = 81; 

  /**
   * deploy function
   * @returns 
   */
  async function deployContract() {
   
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // registry
    const Registry = await ethers.getContractFactory("SampleAccountRegistry");
    const registry = await Registry.deploy();
    // NFT
    const NFT = await ethers.getContractFactory("SampleNFT");
    const nft = await NFT.deploy();

    return { 
      registry, 
      nft, 
      owner, 
      otherAccount 
    };
  }

  describe("SampleAccountRegistry test", function () {
    it("mint NFT && create Account", async function () {
      const { 
        registry, 
        nft, 
        owner, 
      } = await loadFixture(deployContract);

      // mint NFT
      await nft.safeMint(owner.address, "");
      // createAccount
      const createdAccountTx = await registry.createAccount(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234,
        "0x00"
      );

      // getAccount address
      const createdAccountAddress = await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      );

      // check balance & created address
      expect(await nft.balanceOf(owner.address)).to.equal(1);
      expect(
        await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      )).to.equal(createdAccountAddress);
    });

    it("mint NFT && create Account × 2", async function () {
      const { 
        registry, 
        nft, 
        owner, 
        otherAccount
      } = await loadFixture(deployContract);

      // mint NFT
      await nft.safeMint(owner.address, "");
      await nft.safeMint(otherAccount.address, "");
      // createAccount × 2
      const createdAccountTx = await registry.createAccount(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234,
        "0x00"
      );

      const createdAccountTx2 = await registry.createAccount(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        1,
        5678,
        "0x00"
      );

      // getAccount address × 2
      const createdAccountAddress = await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      );
      const createdAccountAddress2 = await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        1,
        5678
      );

      // check balance & address
      expect(await nft.balanceOf(owner.address)).to.equal(1);
      expect(await nft.balanceOf(otherAccount.address)).to.equal(1);
      expect(
        await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      )).to.equal(createdAccountAddress);
      expect(
        await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        1,
        5678
      )).to.equal(createdAccountAddress2);
    });

    it("mint NFT && create Account && transfer NFT", async function () {
      const { 
        registry, 
        nft, 
        owner, 
        otherAccount
      } = await loadFixture(deployContract);
  
      // mint NFT
      await nft.safeMint(owner.address, "");
      // createAccount
      const createdAccountTx = await registry.createAccount(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234,
        "0x00"
      );
  
      // getAccount address
      const createdAccountAddress = await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      );
  
      // check balance & created address
      expect(await nft.balanceOf(owner.address)).to.equal(1);
      expect(
        await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      )).to.equal(createdAccountAddress);
  
      // transfer NFT
      await nft.transferFrom(owner.address, otherAccount.address, 0);
      // get transfered Account address
      const transferedAccountAddress = await registry.account(
        IMPL_ADDRESS,
        CHAIN_ID,
        nft.address,
        0,
        1234
      );
  
      expect(await nft.balanceOf(owner.address)).to.equal(0);
      expect(await nft.balanceOf(otherAccount.address)).to.equal(1);
      expect(transferedAccountAddress).to.equal(createdAccountAddress);
    });
  });
});
