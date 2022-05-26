// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract CoinflipV3 is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    event RandomNumberFulfilled(uint256);
    event RandomNumberRequested(uint256);
    uint64 s_subscriptionId;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    mapping(uint256 => uint256) public log;

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function requestRandomWords() external {
        uint256 request_id = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        emit RandomNumberRequested(request_id);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        log[requestId] = randomWords[0];
        emit RandomNumberFulfilled(requestId);
    }
}
