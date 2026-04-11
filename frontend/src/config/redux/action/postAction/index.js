import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/posts/All", {
                headers: {
                    Authorization: `${user.token}`,
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const createNewPost = createAsyncThunk(
    "post/createNewPost",
    async (user, thunkAPI) => {
        try {
            const formData = new FormData();

            formData.append("token", user.token);
            formData.append("body", user.body);

            //image
            if (user.images.length > 0) {
                user.images.forEach((img) => {
                    formData.append("media", img);
                });
            }

            //video
            if (user.video) {
                formData.append("media", user.video);
            }

            const response = await clientServer.post("/post/create", formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
            });


            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const likePost = createAsyncThunk(
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


export const dislikePost = createAsyncThunk(
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


export const createNewComment = createAsyncThunk(
    "post/createComment",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/post/add/comment", {
                token: user.token,
                postId: user.postId,
                body: user.body,
            });

            return thunkAPI.fulfillWithValue({
                postId: user.postId,
                comments: response.data.comment,
                message: response.data.message,
            });

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getAllCommentsForAPost = createAsyncThunk(
    "post/postId/getAllComments",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/post/AllComments/${user.postId}`);

            return thunkAPI.fulfillWithValue({
                postId: user.postId,
                comments: response.data.comments,
                message: response.data.message,
            });

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getPostInfo = createAsyncThunk(
    "post/:postId",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get(`/post/${user.postId}`, {
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


export const deleteCommentById = createAsyncThunk(
    "post/delete/comment",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.delete("/post/delete/comment", {
                data: {
                    token: user.token,
                    commentId: user.commentId
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


