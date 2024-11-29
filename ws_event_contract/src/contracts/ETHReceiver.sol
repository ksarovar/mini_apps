// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHReceiver is Ownable {
    event ETHReceived(address indexed from, uint256 amount);
    
    constructor() Ownable(msg.sender) {}

    // Function to receive ETH
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }

    // Function to withdraw ETH (only owner)
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }
}