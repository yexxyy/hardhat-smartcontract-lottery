import {
  RaffleEnter as RaffleEnterEvent,
  RequestedRaffleWinner as RequestedRaffleWinnerEvent,
  WinnerPicked as WinnerPickedEvent
} from "../generated/Raffle/Raffle"
import {
  RaffleEnter,
  RequestedRaffleWinner,
  WinnerPicked
} from "../generated/schema"

export function handleRaffleEnter(event: RaffleEnterEvent): void {
  let entity = new RaffleEnter(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.palyer = event.params.palyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestedRaffleWinner(
  event: RequestedRaffleWinnerEvent
): void {
  let entity = new RequestedRaffleWinner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWinnerPicked(event: WinnerPickedEvent): void {
  let entity = new WinnerPicked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.winner = event.params.winner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
