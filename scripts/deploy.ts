import { ethers, getNamedAccounts } from "hardhat";
import { ERC20 } from "../typechain-types";

async function main() {
  try {
    const { deployer } = await getNamedAccounts();
    const erc20Contract: ERC20 = await ethers.getContract("ERC20", deployer);

    console.log((await erc20Contract.totalSupply()).toNumber());

    /**
     * balanceOf owner of the token
     */
    console.log((await erc20Contract.balanceOf(deployer)).toNumber());

    await erc20Contract.approve(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "20"
    );

    console.log(
      (
        await erc20Contract.allowance(
          deployer,
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        )
      ).toString()
    );
  } catch (error) {
    console.log(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
