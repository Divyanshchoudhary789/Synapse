import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/login", {
                email: user.loginEmail,
                password: user.loginPassword,
            });


            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token Not Provided!"
                });
            }

            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/signup",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/signup", {
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password,
            });

            return thunkAPI.fulfillWithValue(response.data.message);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/getUserAndProfile", {
                headers: {
                    Authorization: `${user.token}`
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {

            const response = await clientServer.get("/users/All");

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getUserProfile = createAsyncThunk(
    "user/profile/:userId",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get(`/user/profile/${user.userId}`);

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getAllUserPosts = createAsyncThunk(
    "user/posts/userId",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get(`/user/posts/${user.userId}`);

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const AuthLikePost = createAsyncThunk(
    "post/like",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.patch("/post/like", {
                postId: user.postId,
                token: user.token,
            });

            console.log(response);
            return thunkAPI.fulfillWithValue(response.data.message);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const AuthDislikePost = createAsyncThunk(
    "post/dislike",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.patch("/post/dislike", {
                postId: user.postId,
                token: user.token,
            });

            return thunkAPI.fulfillWithValue(response.data.message);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getAllUserComments = createAsyncThunk(
    "user/allComments/:userId",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get(`/user/allComments/${user.userId}`);

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const updateUserProfilePicture = createAsyncThunk(
    "update/profile-picture",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.put("/update/profile-picture", user.file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `${user.token}`
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const updateUserBannerImage = createAsyncThunk(
    "update/banner-image",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.put("/update/banner-image", user.file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `${user.token}`
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const updateUserDetails = createAsyncThunk(
    "update-user-info",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.patch("/update-user-info", {
                token: user.token,
                name: user.name,
                email: user.email,
                username: user.username,
            });

            return thunkAPI.fulfillWithValue(response.data.message);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const updateUserProfileDetails = createAsyncThunk(
    "/update-user-profile",
    async (data, thunkAPI) => {
        try {

            const response = await clientServer.put("/update-user-profile", data);

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const updateProfileSectionBulk = createAsyncThunk(
    "user/profile/update-section",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.patch("/user/profile/update-section", data);

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);



export const addProfileSectionItem = createAsyncThunk(
    "user/profile/add-section-item",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/profile/add-section-item", data);

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const deleteProfileSectionItem = createAsyncThunk(
    "user/profile/delete-section-item",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.delete("/user/profile/delete-section-item", {
                data: data
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const download_resume = createAsyncThunk(
    "user/download_resume/:userId",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get(`/user/download_resume/${user.userId}`);

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const sendConnectionRequest = createAsyncThunk(
    "user/send_connection_request",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.connectionId,
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getConnectionRequestsToApprove = createAsyncThunk(
    "user/getConnectionRequests",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/user/getConnectionRequests", {
                headers: {
                    Authorization: `${user?.token}`
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const acceptConnectionRequest = createAsyncThunk(
    "user/accept_connection_request",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.patch("/user/accept_connection_request", {
                token: user.token,
                requestId: user.requestId,
                action_type: "accept",
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);



export const getUserConnections = createAsyncThunk(
    "user/user_connections",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/user/user_connections", {
                headers: {
                    Authorization: `${user.token}`
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);




export const deletePostById = createAsyncThunk(
    "post/delete",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.delete("/post/delete", {
                data: {
                    token: user.token,
                    postId: user.postId,
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);