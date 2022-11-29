// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    // 状态变量
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable COORDINATOR;
    bytes32 private immutable i_gasLane;
    // 事件变量
    event RaffleEnter(address indexed palyer);

    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
    }

    function enterRaffle() public payable {
        // 缴费抽奖
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        // 发送事件
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() internal {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(i_gasLane, s_subscriptionId, requestConfirmations, callbackGasLimit, numWords);
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
