const { Contract } = require("ethers")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = ["0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C"]
    const FaucetContract = await deploy("Faucet", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(FaucetContract.address, args)
    }
}
