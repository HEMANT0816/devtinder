const ConnectionRequest = require('../model/ConnectionRequest');
const User = require('../model/user');

const sendConnectionRequest = async (req, res) => {
    try {
        const senderId = req.userId// Extract senderId from the authenticated user
        const receiverId = req.params.receiverId;
        const status= req.params.status; // Extract receiverId from the request parameters
    
        console.log("senderId", senderId);

        console.log("receiverId", receiverId);
        // Prevent users from sending a request to themselves
         // Extract status from the request parameters
        if (senderId === receiverId) {
            return res.status(400).json({ message: 'You cannot send a connection request to yourself.' });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }
        // Check if the sender and receiver are already connected

        // Validate status
        if (!['interested', 'ignore'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Use "interested" or "ignore".' });
        }

        // Check if a connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderId, receiverId, status: 'interested' }, 
                { senderId: receiverId, receiverId: senderId, status: 'interested' }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'Connection request already exists.' });
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            senderId,
            receiverId,
            status,
        });

        await connectionRequest.save(); 

        res.status(201).json({ message: 'Connection request sent successfully.', connectionRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending the connection request.' });
    }
};

const reviewConnectionRequest=async(req,res)=>{

    try {
        //fetch the data
        const status=req.params.status;
        const requestId=req.params.requestId; 

        //find the  request

        const validStatus=["accepted","rejected"];
        //check if the status is valid
         
        if(!validStatus.includes(status)){
            throw new Error("invalid status")
        }


        //check if the requestId is valid
        if(!requestId){
            throw new Error("requestId is required")
        }
        const connectionRequest=await ConnectionRequest.findById(requestId);

        if(!connectionRequest){
            throw new Error("connection Request does not exist")
        }



        //check if the user is the receiver
        if(connectionRequest.receiverId.toString()!==req.userId){
            throw new Error("you are not the receiver of this request")
        }
        //check the status
        let notValidStatusOfConnectionRequest=['ignore', 'accepted', 'rejected'];

        if(notValidStatusOfConnectionRequest.includes(connectionRequest.status)){
            throw new Error("you cant change their already Response")
        }

        connectionRequest.status=status;
        await connectionRequest.save();

        return res.status(200).json({
            message: `Connection request ${status} successfully`,
            request: connectionRequest
        });

    } catch (error) {

        console.error("Error reviewing connection request:", error);
        return res.status(500).json({
            message: "An error occurred while reviewing the request",
            error: error.message
        });
        
    }
}

const getAllConnectionRequest=async(req,res)=>{
    try {
        const userId=req.userId;
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {senderId:userId},
                {receiverId:userId}
            ]
        }).populate({path:"senderId" ,select:"email firstName lastName"}).populate({path:"receiverId" ,select:"email firstName lastName"}).exec();

        return res.status(200).json({
            message:"all connection requests",
            connectionRequests
        })
    } catch (error) {
        console.error("Error fetching connection requests:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the connection requests",
            error: error.message
        });
    }
}


const userFeed = async (req, res) => {
    try {
        const userId = req.userId;
        const skip=req.query.page;

        console.log("value of query",skip)

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { senderId: userId },
                { receiverId: userId}
            ]
        }).select('senderId receiverId').lean(); // lean() for performance if you don't need mongoose doc methods

        const userIds = new Set();
        userIds.add(userId)

        connectionRequests.forEach((request) => {
         
                userIds.add(request.senderId.toString());
                userIds.add(request.receiverId.toString());
            
        });

        const invalid=[...userIds]

        // console.log("userId->",userIds)

        // console.log("our array is ",invalid);

        const userFeeds=await User.find({_id:{$nin:invalid}}).skip((skip-1)*10).limit(10)

        res.status(200).json({
            message: 'Connection requests fetched successfully',
            userIds: userFeeds
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error while fetching connection requests',
            error: error.message
        });
    }
};

const pendingRequests = async (req, res) => {
    try {  
        const userId = req.userId;

        const pendingRequests = await ConnectionRequest.find({
            $or: [
                { receiverId: userId, status: 'interested' }
            ]
        }).populate('senderId', 'firstName lastName age photoUrl gender about').limit(10).exec();


        res.status(200).json({
            message: 'Pending connection requests fetched successfully',
            pendingRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error while fetching pending connection requests',
            error: error.message
        });
    }
};

module.exports = { sendConnectionRequest ,reviewConnectionRequest,getAllConnectionRequest, userFeed, pendingRequests };