const { Contract } = require("ethers")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [10000000000, 50]
    const InterToken = await deploy("InterToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(InterToken.address, args)
    }
}
