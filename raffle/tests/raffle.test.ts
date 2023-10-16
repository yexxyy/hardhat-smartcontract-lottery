import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { RaffleEnter } from "../generated/schema"
import { RaffleEnter as RaffleEnterEvent } from "../generated/Raffle/Raffle"
import { handleRaffleEnter } from "../src/raffle"
import { createRaffleEnterEvent } from "./raffle-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let palyer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newRaffleEnterEvent = createRaffleEnterEvent(palyer)
    handleRaffleEnter(newRaffleEnterEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("RaffleEnter created and stored", () => {
    assert.entityCount("RaffleEnter", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "RaffleEnter",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "palyer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
