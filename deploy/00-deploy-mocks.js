const { developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")

// https://docs.chain.link/vrf/v2/subscription/supported-networks#goerli-testnet
// Premium	0.25 LINK, 每个请求的GAS费
const BASE_FREE = ethers.utils.parseEther("0.25")
// 像是一个换算比例，使得GAS费不会高得离谱
const GAS_PRICE_LINK = 1e9

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // 本地开发环境部署 VRFCoordinatorV2Mock
        // https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            // args 需要传递什么参数查看合约的初始化方法
            // constructor(uint96 _baseFee, uint96 _gasPriceLink) {
            args: [BASE_FREE, GAS_PRICE_LINK],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log("Please run `npx hardhat console` to interact with the deployed smart contracts!")
        log("------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
