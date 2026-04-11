import { createSlice } from "@reduxjs/toolkit"
import { createNewComment, createNewPost, deleteCommentById, dislikePost, getAllCommentsForAPost, getAllPosts, getPostInfo, likePost } from "../../action/postAction";



const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    newPostCreated: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    postId: "",
    comments: {},
    isLiked: false,
    postInfo: [],
    isDeleted: false,
}


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching All Posts from server."
                };
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.postFetched = true;
                state.posts = action.payload.posts;
                state.message = action.payload.message;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(createNewPost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Creating a New Post"
                };
            })
            .addCase(createNewPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.newPostCreated = true;
                state.message = action.payload.message;
            })
            .addCase(createNewPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(likePost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Liking a Post"
                }
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isLiked = true;
                state.message = action.payload.message;
            })
            .addCase(likePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(dislikePost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Disliking a Post"
                }
            })
            .addCase(dislikePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isLiked = false;
                state.message = action.payload.message;
            })
            .addCase(dislikePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(createNewComment.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Creating new Comment"
                }
            })
            .addCase(createNewComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                const { postId, comment } = action.payload;

                state.comments = {
                    ...state.comments,
                    [postId]: [comment, ...(state.comments[postId] || [])]
                };
                state.message = action.payload.message;
            })
            .addCase(createNewComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getAllCommentsForAPost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching all comments for a post"
                }
            })
            .addCase(getAllCommentsForAPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                const { postId, comments } = action.payload;

                state.comments = {
                    ...state.comments,
                    [postId]: comments
                };

                state.message = action.payload.message;
            })
            .addCase(getAllCommentsForAPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getPostInfo.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching Post Info using postId"
                }
            })
            .addCase(getPostInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.postInfo = [action.payload.post];
                state.message = action.payload.message;
            })
            .addCase(getPostInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(deleteCommentById.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Deleting Comment using its Id"
                }
            })
            .addCase(deleteCommentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
                state.isDeleted = true;
                const { commentId, postId } = action.payload;
                if (state.comments[postId]) {
                    state.comments[postId] = state.comments[postId].filter((comment) => comment._id !== commentId);
                }
            })
            .addCase(deleteCommentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })






    }
});


export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;