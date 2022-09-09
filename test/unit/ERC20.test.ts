import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { ERC20 } from "../../typechain-types";

describe("ERC20", () => {
  let deployer: string;
  let accounts: SignerWithAddress[];
  let erc20Contract: ERC20;

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    accounts = await ethers.getSigners();
    await deployments.fixture("all");
    erc20Contract = await ethers.getContract("ERC20", deployer);
  });

  describe("constrcutor", () => {
    it("should create the token with the specified name, symbols, decimals and totalSupply", async () => {
      assert.equal((await erc20Contract.totalSupply()).toString(), "10000");
    });
  });

  describe("balanceOf", () => {
    it("should return the num of tokens held by the address", async () => {
      assert.equal(
        (await erc20Contract.balanceOf(deployer)).toString(),
        "10000"
      );
    });
  });

  describe("transfer", () => {
    it("should revert with error if sender doesnot have enough value", async () => {
      const erc20ConnectedContract = erc20Contract.connect(accounts[2]);
      expect(
        erc20ConnectedContract.transfer(deployer, "10")
      ).to.be.revertedWith("ERC20__NotEnoughBalance");
    });

    it("should transfer tokens from sender to reciever", async () => {
      const balanceBeforeForSender = await erc20Contract.balanceOf(deployer);
      const balanceBeforeForReciever = await erc20Contract.balanceOf(
        accounts[1].address
      );

      await erc20Contract.transfer(accounts[1].address, "10");

      const balanceAfterForSender = await erc20Contract.balanceOf(deployer);
      const balanceAfterForReciever = await erc20Contract.balanceOf(
        accounts[1].address
      );

      assert.equal(
        balanceBeforeForSender.sub(10).toString(),
        balanceAfterForSender.toString()
      );
      assert.equal(
        balanceBeforeForReciever.add(10).toString(),
        balanceAfterForReciever.toString()
      );
    });

    it("should emit Transfer event", async () => {
      expect(erc20Contract.transfer(accounts[1].address, "10")).to.emit(
        erc20Contract,
        "Transfer"
      );
    });
  });

  describe("transferFrom", () => {
    it("should revert with error if sender doesnot have enough value", async () => {
      expect(
        erc20Contract.transferFrom(accounts[1].address, deployer, "10")
      ).to.be.revertedWith("ERC20__NotEnoughBalance");
    });

    it("should revert with error if sender has not approved enough value", async () => {
      expect(
        erc20Contract.transferFrom(deployer, accounts[1].address, "10")
      ).to.be.revertedWith("ERC20__NotEnoughApprovedBalance");
    });

    it("should allow owner to approve a certain value which the sender could spend on owner's behalf", async () => {
      const senderBeforeBal = await erc20Contract.balanceOf(deployer);
      const recieverBeforeBal = await erc20Contract.balanceOf(
        accounts[1].address
      );
      await erc20Contract.approve(accounts[1].address, "20");

      const allowedBefore = await erc20Contract.allowance(
        deployer,
        accounts[1].address
      );

      await erc20Contract.transferFrom(deployer, accounts[1].address, "10");

      const senderAfterBal = await erc20Contract.balanceOf(deployer);
      const recieverAfterBal = await erc20Contract.balanceOf(
        accounts[1].address
      );
      const allowedAfter = await erc20Contract.allowance(
        deployer,
        accounts[1].address
      );

      assert.equal(
        senderBeforeBal.sub(10).toString(),
        senderAfterBal.toString()
      );
      assert.equal(
        recieverBeforeBal.add(10).toString(),
        recieverAfterBal.toString()
      );
      assert.equal(allowedBefore.sub(10).toString(), allowedAfter.toString());
    });

    it("should emit Transfer event", async () => {
      expect(
        erc20Contract.transferFrom(deployer, accounts[1].address, "10")
      ).to.emit(erc20Contract, "Transfer");
    });
  });

  describe("approve", () => {
    it("should revert with error if sender doesnot have enough value", async () => {
      const erc20ConnectedContract = erc20Contract.connect(accounts[2]);
      expect(
        erc20ConnectedContract.approve(accounts[1].address, "10")
      ).to.be.revertedWith("ERC20__NotEnoughBalance");
    });

    it("should emit Approval event", async () => {
      expect(erc20Contract.approve(accounts[1].address, "10")).to.emit(
        erc20Contract,
        "Approval"
      );
    });
  });

  describe("allowance", () => {
    it("should return the allowed value which the caller could spent", async () => {
      await erc20Contract.approve(accounts[1].address, "10");

      assert.equal(
        (
          await erc20Contract.allowance(deployer, accounts[1].address)
        ).toString(),
        "10"
      );
    });
  });
});
