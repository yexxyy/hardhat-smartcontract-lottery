import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  RaffleEnter,
  RequestedRaffleWinner,
  WinnerPicked
} from "../generated/Raffle/Raffle"

export function createRaffleEnterEvent(palyer: Address): RaffleEnter {
  let raffleEnterEvent = changetype<RaffleEnter>(newMockEvent())

  raffleEnterEvent.parameters = new Array()

  raffleEnterEvent.parameters.push(
    new ethereum.EventParam("palyer", ethereum.Value.fromAddress(palyer))
  )

  return raffleEnterEvent
}

export function createRequestedRaffleWinnerEvent(
  requestId: BigInt
): RequestedRaffleWinner {
  let requestedRaffleWinnerEvent = changetype<RequestedRaffleWinner>(
    newMockEvent()
  )

  requestedRaffleWinnerEvent.parameters = new Array()

  requestedRaffleWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return requestedRaffleWinnerEvent
}

export function createWinnerPickedEvent(winner: Address): WinnerPicked {
  let winnerPickedEvent = changetype<WinnerPicked>(newMockEvent())

  winnerPickedEvent.parameters = new Array()

  winnerPickedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )

  return winnerPickedEvent
}
