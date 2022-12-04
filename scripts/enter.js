/**
 * 这是参加抽奖的脚本，调用 enterRaffle即可
 * 另外，在 https://goerli.etherscan.io/address/0x6407715C9F87f44700Da22281994d6799d81DA6F#writeContract
 * 一样可以连接钱包进行交互
 */

const { ethers } = require("hardhat")

async function enterRaffle() {
    const raffle = await ethers.getContract("Raffle")
    const entranceFee = await raffle.getEntranceFee()
    await raffle.enterRaffle({ value: entranceFee + 1 })
    console.log("Entered!")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
