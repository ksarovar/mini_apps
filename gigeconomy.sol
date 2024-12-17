// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GigEconomy {
    struct Job {
        uint256 id;
        address client;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        address freelancer;
        bool completed;
        bool paid;
        bool inDispute;
    }

    struct Bid {
        uint256 jobId;
        address freelancer;
        uint256 proposedBudget;
        uint256 proposedDeadline;
    }

    struct Review {
        address reviewer;
        address reviewee;
        uint256 rating;
        string comment;
    }

    uint256 public jobCount;
    uint256 public bidCount;
    uint256 public reviewCount;
    
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => Review) public reviews;
    mapping(address => uint256) public reputationScores;
    mapping(uint256 => bool) public jobBids;

    event JobPosted(uint256 jobId, address client, string title, string description, uint256 budget, uint256 deadline);
    event BidSubmitted(uint256 bidId, uint256 jobId, address freelancer, uint256 proposedBudget, uint256 proposedDeadline);
    event BidAccepted(uint256 jobId, address freelancer);
    event WorkCompleted(uint256 jobId);
    event PaymentReleased(uint256 jobId, address freelancer, uint256 amount);
    event DisputeInitiated(uint256 jobId);
    event DisputeResolved(uint256 jobId, address winner);

    function postJob(string memory title, string memory description, uint256 budget, uint256 deadline) public {
        jobCount++;
        jobs[jobCount] = Job(jobCount, msg.sender, title, description, budget, deadline, address(0), false, false, false);
        emit JobPosted(jobCount, msg.sender, title, description, budget, deadline);
    }

    function submitBid(uint256 jobId, uint256 proposedBudget, uint256 proposedDeadline) public {
        require(jobs[jobId].freelancer == address(0), "Job already has an accepted bid");
        bidCount++;
        bids[bidCount] = Bid(jobId, msg.sender, proposedBudget, proposedDeadline);
        jobBids[jobId] = true;
        emit BidSubmitted(bidCount, jobId, msg.sender, proposedBudget, proposedDeadline);
    }

    function acceptBid(uint256 jobId, address freelancer) public payable {
        require(jobs[jobId].client == msg.sender, "Only the client can accept a bid");
        require(jobBids[jobId], "No bids submitted for this job");
        require(msg.value == jobs[jobId].budget, "Incorrect payment amount");
        jobs[jobId].freelancer = freelancer;
        emit BidAccepted(jobId, freelancer);
    }

    function completeWork(uint256 jobId) public {
        require(jobs[jobId].freelancer == msg.sender, "Only the accepted freelancer can complete the work");
        jobs[jobId].completed = true;
        emit WorkCompleted(jobId);
    }

    function releasePayment(uint256 jobId) public {
        require(jobs[jobId].client == msg.sender, "Only the client can release the payment");
        require(jobs[jobId].completed, "Work is not completed");
        require(!jobs[jobId].paid, "Payment already released");
        jobs[jobId].paid = true;
        payable(jobs[jobId].freelancer).transfer(jobs[jobId].budget);
        emit PaymentReleased(jobId, jobs[jobId].freelancer, jobs[jobId].budget);
    }

    function initiateDispute(uint256 jobId) public {
        require(jobs[jobId].client == msg.sender || jobs[jobId].freelancer == msg.sender, "Only the client or freelancer can initiate a dispute");
        require(!jobs[jobId].inDispute, "Dispute already initiated");
        jobs[jobId].inDispute = true;
        emit DisputeInitiated(jobId);
    }

    function resolveDispute(uint256 jobId, address winner) public {
        require(jobs[jobId].inDispute, "No dispute initiated");
        require(winner == jobs[jobId].client || winner == jobs[jobId].freelancer, "Invalid dispute resolution");
        jobs[jobId].inDispute = false;
        if (winner == jobs[jobId].freelancer) {
            payable(jobs[jobId].freelancer).transfer(jobs[jobId].budget);
        } else {
            payable(jobs[jobId].client).transfer(jobs[jobId].budget);
        }
        emit DisputeResolved(jobId, winner);
    }
}
