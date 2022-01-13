import { expect } from "chai";
import { ethers } from "hardhat";

describe("CryptoStar", function () {
  it("Should be called CryptoStar", async function () {

    const CryptoStar = await ethers.getContractFactory("CryptoStar");
    const contract = await CryptoStar.deploy();
    await contract.deployed();

    expect(await contract.name()).to.equal("CryptoStar");
  });
});
