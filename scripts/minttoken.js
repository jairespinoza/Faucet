const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const InterToken = await ethers.getContractFactory("InterToken")
    const interToken = await InterToken.deploy(1000000000, 50)

    await interToken.deployed()

    console.log(`Inter Token succesfully deployed at ${interToken.address}`)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
