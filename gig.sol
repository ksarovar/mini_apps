// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedGigPlatform {
    struct Job {
        address client;
        address freelancer;
        string description;
        uint256 payment;
        bool completed;
        bool paid;
        uint256 escrowId;
        string category;
        uint256[] milestones;
        bool[] milestoneCompleted;
        uint256[] bids;
        address[] bidders;
        bool bidAccepted;
    }

    struct EscrowTransaction {
        address client;
        address freelancer;
        uint256 amount;
        bool released;
    }

    struct Review {
        address reviewer;
        uint256 rating;
        string comment;
    }

    struct UserProfile {
        string name;
        string contact;
        string[] skills;
        bool[] skillVerified;
        bool active;
        bool authenticated;
    }

    struct Dispute {
        address client;
        address freelancer;
        uint256 jobId;
        string description;
        bool resolved;
    }

    address public admin;
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => EscrowTransaction) public escrows;
    mapping(address => Review[]) public reviews;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Dispute) public disputes;
    mapping(string => uint256[]) public jobCategories;
    mapping(address => string[]) public userNotifications; // Changed to dynamic array

    uint256 public jobCount;
    uint256 public escrowCount;
    uint256 public disputeCount;

    event JobCreated(uint256 jobId, address client, string description, uint256 payment, string category);
    event JobCompleted(uint256 jobId);
    event JobPaid(uint256 jobId);
    event EscrowCreated(uint256 escrowId, address client, address freelancer, uint256 amount);
    event EscrowReleased(uint256 escrowId);
    event ReviewAdded(address reviewed, address reviewer, uint256 rating, string comment);
    event DisputeCreated(uint256 disputeId, address client, address freelancer, uint256 jobId, string description);
    event DisputeResolved(uint256 disputeId);
    event ProfileCreated(address user, string name, string contact);
    event SkillVerified(address user, string skill);
    event MilestoneCompleted(uint256 jobId, uint256 milestoneIndex);
    event UserRemoved(address user);
    event BidPlaced(uint256 jobId, address bidder, uint256 bidAmount);
    event BidAccepted(uint256 jobId, address freelancer);
    event NotificationSent(address user, string message);
    event UserAuthenticated(address user);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function createJob(string memory _description, uint256 _payment, string memory _category, uint256[] memory _milestones) public payable {
        require(_payment > 0, "Payment must be greater than zero");
        require(msg.value == _payment, "Payment amount must match the job payment");
        require(userProfiles[msg.sender].active, "Client is not active");

        jobCount++;
        escrowCount++;

        jobs[jobCount] = Job({
            client: msg.sender,
            freelancer: address(0),
            description: _description,
            payment: _payment,
            completed: false,
            paid: false,
            escrowId: escrowCount,
            category: _category,
            milestones: _milestones,
            milestoneCompleted: new bool[](_milestones.length),
            bids: new uint256[](0),
            bidders: new address[](0),
            bidAccepted: false
        });

        escrows[escrowCount] = EscrowTransaction({
            client: msg.sender,
            freelancer: address(0),
            amount: _payment,
            released: false
        });

        jobCategories[_category].push(jobCount);

        emit JobCreated(jobCount, msg.sender, _description, _payment, _category);
        emit EscrowCreated(escrowCount, msg.sender, address(0), _payment);
    }

    function placeBid(uint256 _jobId, uint256 _bidAmount) public {
        Job storage job = jobs[_jobId];
        require(!job.bidAccepted, "Bid has already been accepted for this job");
        require(userProfiles[msg.sender].active, "Freelancer is not active");

        job.bids.push(_bidAmount);
        job.bidders.push(msg.sender);

        emit BidPlaced(_jobId, msg.sender, _bidAmount);
    }

    function acceptBid(uint256 _jobId, address _freelancer) public {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only the client can accept a bid");
        require(!job.bidAccepted, "Bid has already been accepted for this job");

        for (uint256 i = 0; i < job.bidders.length; i++) {
            if (job.bidders[i] == _freelancer) {
                job.freelancer = _freelancer;
                job.payment = job.bids[i];
                job.bidAccepted = true;
                escrows[job.escrowId].freelancer = _freelancer;
                escrows[job.escrowId].amount = job.bids[i];

                emit BidAccepted(_jobId, _freelancer);
                return;
            }
        }
        revert("Freelancer has not placed a bid");
    }

    function completeJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.freelancer == msg.sender, "Only the freelancer can complete the job");
        require(!job.completed, "Job is already completed");

        job.completed = true;

        emit JobCompleted(_jobId);
    }

    function payJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only the client can pay for the job");
        require(job.completed, "Job is not completed");
        require(!job.paid, "Job is already paid");

        EscrowTransaction storage escrow = escrows[job.escrowId];
        require(!escrow.released, "Escrow is already released");

        escrow.released = true;
        job.paid = true;
        payable(job.freelancer).transfer(escrow.amount);

        emit JobPaid(_jobId);
        emit EscrowReleased(job.escrowId);
    }

    function completeMilestone(uint256 _jobId, uint256 _milestoneIndex) public {
        Job storage job = jobs[_jobId];
        require(job.freelancer == msg.sender, "Only the freelancer can complete the milestone");
        require(_milestoneIndex < job.milestones.length, "Invalid milestone index");
        require(!job.milestoneCompleted[_milestoneIndex], "Milestone is already completed");

        job.milestoneCompleted[_milestoneIndex] = true;

        emit MilestoneCompleted(_jobId, _milestoneIndex);
    }

    function addReview(address _reviewed, uint256 _rating, string memory _comment) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        reviews[_reviewed].push(Review({
            reviewer: msg.sender,
            rating: _rating,
            comment: _comment
        }));

        emit ReviewAdded(_reviewed, msg.sender, _rating, _comment);
    }

    function getAverageRating(address _reviewed) public view returns (uint256) {
        Review[] storage userReviews = reviews[_reviewed];
        uint256 totalRating = 0;

        for (uint256 i = 0; i < userReviews.length; i++) {
            totalRating += userReviews[i].rating;
        }

        if (userReviews.length == 0) {
            return 0;
        }

        return totalRating / userReviews.length;
    }

    function createProfile(string memory _name, string memory _contact) public {
        userProfiles[msg.sender] = UserProfile({
            name: _name,
            contact: _contact,
            skills: new string[](0),
            skillVerified: new bool[](0),
            active: true,
            authenticated: false
        });

        emit ProfileCreated(msg.sender, _name, _contact);
    }

    function addSkill(string memory _skill) public {
        UserProfile storage profile = userProfiles[msg.sender];
        profile.skills.push(_skill);
        profile.skillVerified.push(false);
    }

    function verifySkill(address _user, string memory _skill) public {
        UserProfile storage profile = userProfiles[_user];
        for (uint256 i = 0; i < profile.skills.length; i++) {
            if (keccak256(bytes(profile.skills[i])) == keccak256(bytes(_skill))) {
                profile.skillVerified[i] = true;
                emit SkillVerified(_user, _skill);
                return;
            }
        }
        revert("Skill not found");
    }

    function createDispute(address _freelancer, uint256 _jobId, string memory _description) public {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only the client can create a dispute");
        require(job.freelancer == _freelancer, "Invalid freelancer");

        disputeCount++;
        disputes[disputeCount] = Dispute({
            client: msg.sender,
            freelancer: _freelancer,
            jobId: _jobId,
            description: _description,
            resolved: false
        });

        emit DisputeCreated(disputeCount, msg.sender, _freelancer, _jobId, _description);
    }

    function resolveDispute(uint256 _disputeId) public {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.client == msg.sender || dispute.freelancer == msg.sender, "Only the client or freelancer can resolve the dispute");
        require(!dispute.resolved, "Dispute is already resolved");

        dispute.resolved = true;

        emit DisputeResolved(_disputeId);
    }

    function getJobsByCategory(string memory _category) public view returns (uint256[] memory) {
        return jobCategories[_category];
    }

    function sendNotification(address _user, string memory _message) public {
        userNotifications[_user].push(_message); // Changed to dynamic array
        emit NotificationSent(_user, _message);
    }

    function authenticateUser(address _user) public onlyAdmin {
        require(!userProfiles[_user].authenticated, "User is already authenticated");
        userProfiles[_user].authenticated = true;
        emit UserAuthenticated(_user);
    }

    // Admin Functionality
    function removeUser(address _user) public onlyAdmin {
        require(userProfiles[_user].active, "User is already inactive");
        userProfiles[_user].active = false;
        emit UserRemoved(_user);
    }
}
