import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ERC20", {
    from: deployer,
    args: ["ManualToken", "MT", 18, 10000],
    log: true,
    contract: "ERC20",
  });
};

export default deployFundMe;
deployFundMe.tags = ["all", "erc20"];
