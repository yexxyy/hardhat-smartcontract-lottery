const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle合约测试", async function () {
          let raffle, VRFCoordinatorV2Mock, raffleEntranceFee, deployer, interval

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              // 重制部署环境，all为TAG module.exports.tags = ["all", "raffle"]
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", async function () {
              it("正常", async function () {
                  // 将初始化方法中的所有参数都校验一遍...
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
              })
          })

          describe("enterRaffle", async function () {
              it("付款金额不够时撤销", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered")
              })

              it("用户参与抽奖成功", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })

              it("参与抽奖成功后的事件提交", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(raffle, "RaffleEnter")
              })

              it("参与抽奖失败: RaffleState not OPEN", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  // we pretend to be a keeper for a second
                  await raffle.performUpkeep([]) // changes the state to calculating for our comparison below
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      // is reverted as raffle is calculating
                      "Raffle__NotOpen"
                  )
              })
          })

          describe("checkUpkeep", async function () {
              it("没有人参与抽奖返回False", async function () {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
          })
      })
