import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import ConnectionRequest from "../models/connectionModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

import uploadToR2 from "../utils/r2Upload.js";
import deleteFromR2 from "../utils/deleteFromR2.js";
import convertUserDataToPdf from "../utils/convertUserDataToPdf.js";
import mongoose from "mongoose";



const signup = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All Fields are required!" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const newProfile = new Profile({
            userId: savedUser._id,
        });

        await newProfile.save();

        res.json({ message: "User Created Successfully" });

    } catch (err) {
        console.log("Error during user creation:", err.message);
        res.status(500).send("Server Error");
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are Required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.token = token;
        await user.save();

        res.json({ message: "User Logged In Successfully", token });

    } catch (err) {
        console.log("Error during logging in a user:", err.message);
        res.status(500).send("Server Error");
    }
}



const updateProfilePicture = async (req, res) => {
    const token = req.headers.authorization;
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No Image Uploaded!" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(400).json({ message: "User not Found!" });
        }

        //delete old image if exists
        if (user.profilePictureKey) {
            await deleteFromR2(user.profilePictureKey);
        }

        // upload new image
        const result = await uploadToR2(req.file, "profiles");

        user.profilePicture = result.url;
        user.profilePictureKey = result.key;

        await user.save();

        res.status(200).json({ message: "Profile picture Updated Successfully", profilePicture: user.profilePicture });

    } catch (err) {
        console.error("Failed To Update Profile Picture:", err.message);
        res.status(500).send("Server Error");
    }
}


const updateBannerImage = async (req, res) => {
    const token = req.headers.authorization;
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No Image Uploaded!" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(400).json({ message: "User not Found!" });
        }

        //delete old image if exists
        if (user.bannerImageKey) {
            await deleteFromR2(user.bannerImageKey);
        }

        // upload new image
        const result = await uploadToR2(req.file, "banners");

        user.bannerImage = result.url;
        user.bannerImageKey = result.key;

        await user.save();

        res.status(200).json({ message: "Banner Image Updated Successfully", bannerImage: user.bannerImage });

    } catch (err) {
        console.error("Failed To Update Profile Picture:", err.message);
        res.status(500).send("Server Error");
    }
}



const updateUserInfo = async (req, res) => {
    const { token, ...newUserData } = req.body;

    try {

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        // Username check
        if (newUserData.username) {
            const existingUsername = await User.findOne({ username: newUserData.username });

            if (existingUsername && String(existingUsername._id) !== String(user._id)) {
                return res.status(400).json({ message: "Username already exists!" });
            }
        }


        // Email check
        if (newUserData.email) {
            const existingEmail = await User.findOne({ email: newUserData.email });

            if (existingEmail && String(existingEmail._id) !== String(user._id)) {
                return res.status(400).json({ message: "Email already exists!" });
            }
        }


        Object.assign(user, newUserData);

        await user.save();

        return res.json({ message: "User Updated Successfully." });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getUserAndProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const profile = await Profile.findOne({ userId: user._id }).populate("userId", "name email username profilePicture bannerImage");

        return res.json({ message: "user profile fetched successfully.", profile });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const updateUserProfile = async (req, res) => {
    try {

        const { token, ...newProfileData } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User Not Found!" });
        }

        //safe filtering
        Object.keys(newProfileData).forEach((key) => {
            if (newProfileData[key] === "" || newProfileData[key] === undefined) {
                delete newProfileData[key];
            }
        });

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { $set: newProfileData },
            { returnDocument: "after", runValidators: true }
        );

        return res.json({
            message: "Profile Updated Successfully",
            profile: updatedProfile
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({});
        if (!users) {
            return res.status(400).json({ message: "Users Not Found!" });
        }

        return res.json({ message: "Users Fetched Successfully.", users });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const getAllUsersProfiles = async (req, res) => {
    try {

        const profiles = await Profile.find({}).populate("userId", "name username email profilePicture bannerImage");
        if (!profiles) {
            return res.status(400).json({ message: "Users Profiles Not Found" });
        }

        return res.json({ message: "Users Profiles Fetched Successfully", profiles });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const downloadUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const userProfile = await Profile.findOne({ userId }).populate("userId", "name email username profilePicture bannerImage");
        if (!userProfile) {
            return res.status(400).json({ message: "User Profile Not Found!" });
        }

        const result = await convertUserDataToPdf(userProfile);

        return res.json({ message: "Resume created Successfully", url: result.url });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const sendConnectionRequest = async (req, res) => {
    const { token, connectionId } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });
        if (!connectionUser) {
            return res.status(404).json({ message: "Connection User not found!" });
        }

        const existingRequest = await ConnectionRequest.findOne({ userId: user._id, connectionId: connectionUser._id });
        if (existingRequest) {
            return res.status(400).json({ message: "Request Already Sent!" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id,
        });

        await request.save();

        return res.json({ message: "Connection Request Sent Successfully!", request });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}





const getConnectionRequests = async (req, res) => {
    try {
        const token = req.headers.authorization;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const requests = await ConnectionRequest.find({ connectionId: user._id, status_accepted: null }).populate("userId", "name username email profilePicture bannerImage");
        if (!requests) {
            return res.status(404).json({ message: "Connection Requests Not Found!" });
        }


        return res.json({ message: "Connection requests fetched Successfully.", requests });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getUserConnections = async (req, res) => {
    try {
        const token = req.headers.authorization;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const connections = await ConnectionRequest.find({ $or: [{ userId: user._id }, { connectionId: user._id }], status_accepted: true }).populate("connectionId", "name username email profilePicture bannerImage").populate("userId", "name username email profilePicture bannerImage");

        if (connections.length == 0) {
            return res.status(200).json({ message: "No Connections found!", connections: [] });
        }

        const result = connections.map((conn) => {
            return conn.userId._id.toString() === user._id.toString() ? conn.connectionId : conn.userId;
        });

        /*if  userId = me → return connectionId
        userId ≠ me → return userId */


        return res.json({ message: "User Connections fetched Successfully.", connections: result });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const request = await ConnectionRequest.findOne({ _id: requestId });
        if (!request) {
            return res.status(404).json({ message: "Request does not exists!" });
        }

        if (action_type === "accept") {
            request.status_accepted = true;
        } else {
            request.status_accepted = false;
        }


        await request.save();

        return res.json({ message: "Request status updated successfully.", request });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getUserProfileByUserId = async (req, res) => {
    try {

        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }

        const profile = await Profile.findOne({ userId }).populate("userId", "name email username profilePicture bannerImage");
        if (!profile) {
            return res.status(404).json({ message: "User Profile Not Found!" });
        }

        return res.json({ message: "User Profile Fetched Successfully", profile });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const getAllUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ userId }).populate("userId", "name email username profilePicture bannerImage");
        if (!posts) {
            return res.status(404).json({ message: "User Posts Not Found!" });
        }


        const updatedPosts = posts.map((post) => {
            const postObj = post.toObject();

            return {
                ...postObj,
                likes: post.likes?.length || 0,
                isUserLiked: post.likes?.some((id) => id.toString() === userId.toString()) || false,
            };
        });

        return res.json({ message: "User Posts fetched Successfully", posts: updatedPosts });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const getAllUserComments = async (req, res) => {
    try {
        const { userId } = req.params;

        const comments = await Comment.find({ userId }).populate("userId", "name email username profilePicture bannerImage");
        if (!comments) {
            return res.status(404).json({ message: "User Comments Not Found!" });
        }

        return res.json({ message: "User Comments fetched Successfully", comments });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const updateProfileSectionBulk = async (req, res) => {
    try {
        const { token, section, data } = req.body;

        const allowedSections = ["experience", "education", "languages", "skills"];
        if (!allowedSections.includes(section)) {
            return res.status(400).json({ message: "Invalid Section" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const cleanedData = data
            .map((item) => {
                const newItem = { ...item };

                Object.keys(newItem).forEach((key) => {
                    if (key === "_id") return;

                    if (
                        newItem[key] === "" ||
                        newItem[key] === undefined ||
                        (typeof newItem[key] === "string" && newItem[key].trim() === "")
                    ) {
                        delete newItem[key];
                    }
                });

                return newItem;
            })
            //  remove completely empty objects (except _id)
            .filter((item) => {
                const keys = Object.keys(item).filter(k => k !== "_id");
                return keys.length > 0;
            });

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                $set: {
                    [section]: cleanedData
                }
            },
            { returnDocument: "after", runValidators: true }
        ).populate("userId", "name email username profilePicture bannerImage");

        res.json({
            message: `${section} updated successfully`,
            profile: updatedProfile
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



const addProfileSectionItem = async (req, res) => {
    try {
        const { token, section, item } = req.body;

        const allowedSections = ["experience", "education", "languages", "skills"];
        if (!allowedSections.includes(section)) {
            return res.status(400).json({ message: "Invalid section" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        //  Clean item
        const newItem = { ...item };

        Object.keys(newItem).forEach((key) => {
            if (
                newItem[key] === "" ||
                newItem[key] === undefined ||
                (typeof newItem[key] === "string" && newItem[key].trim() === "")
            ) {
                delete newItem[key];
            }
        });

        //  empty item reject
        if (Object.keys(newItem).length === 0) {
            return res.status(400).json({ message: "Empty item not allowed" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                $push: {
                    [section]: newItem
                }
            },
            { returnDocument: "after", runValidators: true }
        ).populate("userId", "name email username profilePicture bannerImage");

        res.json({
            message: `${section} item added`,
            profile: updatedProfile
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const deleteProfileSectionItem = async (req, res) => {
    try {
        const { token, section, itemId } = req.body;

        const allowedSections = ["experience", "education", "languages", "skills"];
        if (!allowedSections.includes(section)) {
            return res.status(400).json({ message: "Invalid section" });
        }

        if (!itemId) {
            return res.status(400).json({ message: "Item ID is required" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                $pull: {
                    [section]: { _id: itemId }
                }
            },
            { returnDocument: "after" }
        ).populate("userId", "name email username profilePicture bannerImage");

        res.json({
            message: `${section} item deleted`,
            profile: updatedProfile
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export { signup, login, updateProfilePicture, updateUserInfo, getUserAndProfile, updateUserProfile, getAllUsers, getAllUsersProfiles, downloadUserProfile, sendConnectionRequest, getConnectionRequests, getUserConnections, acceptConnectionRequest, getUserProfileByUserId, getAllUserPosts, getAllUserComments, updateBannerImage, updateProfileSectionBulk, addProfileSectionItem, deleteProfileSectionItem };