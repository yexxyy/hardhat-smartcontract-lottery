const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    /** 抽奖合约初始化参数
     *
     * address vrfCoordinatorV2,
     * uint256 entranceFee,
     * bytes32 gasLane,
     * uint64 subscriptionId,
     * uint32 callbackGasLimit,
     * uint256 interval
     */
    let vrfCoordinatorV2Address, subscriptionId

    /**
     * subscriptionId
     * https://vrf.chain.link/goerli/7064
     *
     * 开发环境中可以通过VRFCoordinatorV2Mock createSubscription 中的事件获得 subscriptionId
     * emit SubscriptionCreated(s_currentSubId, msg.sender);
     */

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address

        // subscriptionId
        const response = await VRFCoordinatorV2Mock.createSubscription()
        const receipt = await response.wait(1)
        subscriptionId = receipt.events[0].args.subId
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2Address
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    const entranceFee = networkConfig[chainId].entranceFee

    /**
     * chainlink requestRandomWords 方法参数 keyHash
     * gasLane: GAS费用档位 150 gwei Key Hash
     * https://docs.chain.link/vrf/v2/subscription/supported-networks#goerli-testnet
     * @param keyHash - Corresponds to a particular oracle job which uses
     * that key for generating the VRF proof. Different keyHash's have different gas price
     * ceilings, so you can select a specific one to bound your maximum per request cost.
     */
    const gasLane = networkConfig[chainId].gasLane

    /**
     * requestRandomWords 方法参数
     * @param callbackGasLimit - How much gas you'd like to receive in your
     * fulfillRandomWords callback. Note that gasleft() inside fulfillRandomWords
     * may be slightly less than this amount because of gas used calling the function
     * (argument decoding etc.), so you may need to request slightly more than you expect
     * to have inside fulfillRandomWords. The acceptable range is
     * [0, maxGasLimit]
     */
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit

    const interval = networkConfig[chainId].interval

    const constructorArguments = [vrfCoordinatorV2Address, entranceFee, gasLane, subscriptionId, callbackGasLimit, interval]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: constructorArguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // 如果不是部署在本地环境，则进行验证
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("开始验证Raffle合约...")
        await verify(raffle.address, args)
    }
    log("部署Raffle脚本执行完成.")
}

module.exports.tags = ["all", "raffle"]
