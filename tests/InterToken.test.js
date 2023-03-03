const { assert, expect } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

describe("InterToken contract", function () {
    // global vars
    let Token
    let InterToken
    let owner
    let deployer
    let addr1
    let addr2
    let tokenCap = 100000000
    let tokenBlockReward = 50
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("InterToken")

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        owner = deployer
        addr1 = accounts[1]
        addr2 = accounts[2]
        await deployments.fixture(["all"])

        InterToken = await Token.deploy(tokenCap, tokenBlockReward)
    })

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await InterToken.owner()).to.be.equal(deployer.address)
        })
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await InterToken.balanceOf(deployer.address)
            expect(await InterToken.totalSupply()).to.equal(ownerBalance)
        })

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await InterToken.balanceOf(owner.address)
            expect(await InterToken.totalSupply()).to.equal(ownerBalance)
        })

        it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await InterToken.cap()
            expect(Number(ethers.utils.formatEther(cap))).to.equal(tokenCap)
        })

        it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await InterToken.blockReward()
            expect(Number(ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward)
        })
    })
    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await InterToken.transfer(addr1.address, 50)
            const addr1Balance = await InterToken.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(50)

            await InterToken.connect(addr1).transfer(addr2.address, 50)
            const addr2Balance = await InterToken.balanceOf(addr2.address)
            expect(addr2Balance).to.equal(50)
        })
    })
})
