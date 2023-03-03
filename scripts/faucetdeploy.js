const { ethers } = require("hardhat")

async function main() {
    const faucetContract = await ethers.getContractFactory("Faucet")
    const faucet = await faucetContract.deploy("0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C")
    await faucet.deployed()

    console.log(`Faucet deployed successfully at ${faucet.address}`)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
