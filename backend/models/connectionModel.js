import mongoose from "mongoose";
const Schema = mongoose.Schema;


const ConnectionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    connectionId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status_accepted: {
        type: Boolean,
        default: null
    }

});

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionSchema);


export default ConnectionRequest;
