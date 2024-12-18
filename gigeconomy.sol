// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GigEconomyPlatform {
    enum Role { Client, Freelancer }

    struct User {
        address userAddress;
        string name;
        string email;
        Role role;
        uint256 registrationTime;
        string skills;
        string experience;
        string portfolio;
    }

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

    struct Message {
        address sender;
        address receiver;
        string content;
        uint256 timestamp;
    }

    address public owner;
    uint256 public registrationFee;
    uint256 public jobCount;
    uint256 public bidCount;
    uint256 public reviewCount;
    uint256 public userCount;
    uint256 public messageCount;
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Message) public messages;
    mapping(address => uint256) public reputationScores;
    mapping(uint256 => bool) public jobBids;
    mapping(address => bool) public registeredUsers;
    mapping(address => User) public users;
    mapping(address => Role) public userRoles;
    mapping(address => uint256[]) public userJobs;
    mapping(address => uint256[]) public userBids;
    mapping(address => uint256[]) public userReviews;
    mapping(address => uint256[]) public userMessages;

    event UserRegistered(address user, string name, string email, Role role, string skills, string experience, string portfolio);
    event JobPosted(uint256 jobId, address client, string title, string description, uint256 budget, uint256 deadline);
    event BidSubmitted(uint256 bidId, uint256 jobId, address freelancer, uint256 proposedBudget, uint256 proposedDeadline);
    event BidAccepted(uint256 jobId, address freelancer);
    event WorkCompleted(uint256 jobId);
    event PaymentReleased(uint256 jobId, address freelancer, uint256 amount);
    event ReviewSubmitted(uint256 reviewId, address reviewer, address reviewee, uint256 rating, string comment);
    event DisputeInitiated(uint256 jobId);
    event DisputeResolved(uint256 jobId, address winner);
    event FundsWithdrawn(uint256 amount);
    event UserRemoved(address user);
    event MessageSent(uint256 messageId, address sender, address receiver, string content);

    constructor(uint256 _registrationFee) {
        owner = msg.sender;
        registrationFee = _registrationFee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function registerUser(string memory name, string memory email, Role role, string memory skills, string memory experience, string memory portfolio) public payable {
        require(msg.value == registrationFee, "Incorrect registration fee");
        require(userRoles[msg.sender] == Role(0), "User already registered");
        userCount++;
        users[msg.sender] = User(msg.sender, name, email, role, block.timestamp, skills, experience, portfolio);
        userRoles[msg.sender] = role;
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender, name, email, role, skills, experience, portfolio);
    }

    function removeUser(address user) public onlyOwner {
        require(registeredUsers[user], "User not registered");
        registeredUsers[user] = false;
        userRoles[user] = Role(0);
        delete users[user];
        delete userJobs[user];
        delete userBids[user];
        delete userReviews[user];
        delete userMessages[user];
        reputationScores[user] = 0;
        emit UserRemoved(user);
    }

    function postJob(string memory title, string memory description, uint256 budget, uint256 deadline) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(userRoles[msg.sender] == Role.Client, "Only clients can post jobs");
        jobCount++;
        jobs[jobCount] = Job(jobCount, msg.sender, title, description, budget, deadline, address(0), false, false, false);
        userJobs[msg.sender].push(jobCount);
        emit JobPosted(jobCount, msg.sender, title, description, budget, deadline);
    }

    function submitBid(uint256 jobId, uint256 proposedBudget, uint256 proposedDeadline) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(userRoles[msg.sender] == Role.Freelancer, "Only freelancers can submit bids");
        require(jobs[jobId].freelancer == address(0), "Job already has an accepted bid");
        bidCount++;
        bids[bidCount] = Bid(jobId, msg.sender, proposedBudget, proposedDeadline);
        jobBids[jobId] = true;
        userBids[msg.sender].push(bidCount);
        emit BidSubmitted(bidCount, jobId, msg.sender, proposedBudget, proposedDeadline);
    }

    function acceptBid(uint256 jobId, address freelancer) public payable {
        require(registeredUsers[msg.sender], "User not registered");
        require(userRoles[msg.sender] == Role.Client, "Only clients can accept bids");
        require(jobs[jobId].client == msg.sender, "Only the client can accept a bid");
        require(jobBids[jobId], "No bids submitted for this job");
        require(msg.value == jobs[jobId].budget, "Incorrect payment amount");
        jobs[jobId].freelancer = freelancer;
        emit BidAccepted(jobId, freelancer);
    }

    function completeWork(uint256 jobId) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(userRoles[msg.sender] == Role.Freelancer, "Only freelancers can complete work");
        require(jobs[jobId].freelancer == msg.sender, "Only the accepted freelancer can complete the work");
        jobs[jobId].completed = true;
        emit WorkCompleted(jobId);
    }

    function releasePayment(uint256 jobId) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(userRoles[msg.sender] == Role.Client, "Only clients can release payments");
        require(jobs[jobId].client == msg.sender, "Only the client can release the payment");
        require(jobs[jobId].completed, "Work is not completed");
        require(!jobs[jobId].paid, "Payment already released");
        jobs[jobId].paid = true;
        payable(jobs[jobId].freelancer).transfer(jobs[jobId].budget);
        emit PaymentReleased(jobId, jobs[jobId].freelancer, jobs[jobId].budget);
    }

    function initiateDispute(uint256 jobId) public {
        require(registeredUsers[msg.sender], "User not registered");
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

    function submitReview(address reviewee, uint256 rating, string memory comment) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        reviewCount++;
        reviews[reviewCount] = Review(msg.sender, reviewee, rating, comment);
        reputationScores[reviewee] += rating;
        userReviews[reviewee].push(reviewCount);
        emit ReviewSubmitted(reviewCount, msg.sender, reviewee, rating, comment);
    }

    function sendMessage(address receiver, string memory content) public {
        require(registeredUsers[msg.sender], "User not registered");
        require(registeredUsers[receiver], "Receiver not registered");
        messageCount++;
        messages[messageCount] = Message(msg.sender, receiver, content, block.timestamp);
        userMessages[receiver].push(messageCount);
        emit MessageSent(messageCount, msg.sender, receiver, content);
    }

    function getReputationScore(address user) public view returns (uint256) {
        return reputationScores[user];
    }

    function getUserJobs(address user) public view returns (uint256[] memory) {
        return userJobs[user];
    }

    function getUserBids(address user) public view returns (uint256[] memory) {
        return userBids[user];
    }

    function getUserReviews(address user) public view returns (uint256[] memory) {
        return userReviews[user];
    }

    function getUserMessages(address user) public view returns (uint256[] memory) {
        return userMessages[user];
    }

    function getUserDetails(address user) public view returns (string memory, string memory, string memory, string memory, string memory) {
        User storage userInfo = users[user];
        return (userInfo.name, userInfo.email, userInfo.skills, userInfo.experience, userInfo.portfolio);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
        emit FundsWithdrawn(balance);
    }
}
