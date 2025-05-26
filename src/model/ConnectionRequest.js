const mongoose= require('mongoose');
const connectionRequestSchema = new mongoose.Schema({ 
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Create an index on receiverId for faster lookups
    },
    status: {
        type: String,
        enum:{
            values:  ['interested','ignore', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        },
        
    },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.createdAt = ret.createdAt.toLocaleString('en-IN'); // You can format it as needed
      ret.updatedAt = ret.updatedAt.toLocaleString('en-IN');
      return ret;
    }
  }});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
// This ensures that there are no duplicate connection requests between the same sender and receiver.
module.exports = ConnectionRequest;
// This code defines a Mongoose schema and model for connection requests in a MongoDB database. 