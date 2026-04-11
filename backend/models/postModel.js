import mongoose from "mongoose";
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    body: {
        type: String,
        default: "",
    },

    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    modifiedAt: {
        type: Date,
        default: Date.now,
    },

    media: [
        {
            url: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ["image", "video"],
            },
            key: {
                type: String,
                default: "",
            }
        }
    ],

    active: {
        type: Boolean,
        default: true,
    },

    postType: {
        type: String,
        enum: ["image", "video", "carousel"],
        default: ""
    }

});


const Post = mongoose.model("Post", PostSchema);

export default Post;