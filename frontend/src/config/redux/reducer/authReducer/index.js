import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUserPosts, getAllUsers, getUserProfile, loginUser, registerUser, AuthLikePost, AuthDislikePost, getAllUserComments, updateUserProfilePicture, updateUserBannerImage, updateUserDetails, updateUserProfileDetails, updateProfileSectionBulk, addProfileSectionItem, deleteProfileSectionItem, download_resume, sendConnectionRequest, getConnectionRequestsToApprove, acceptConnectionRequest, getUserConnections, deletePostById } from "@/config/redux/action/authAction";



const initialState = {
    user: [],
    userProfile: [],
    allUsers: [],
    userAllPosts: [],
    allUsersFetched: false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    isLiked: false,
    userAllComments: [],
    isProfileImageUpdated: false,
    isBannerImageUpdated: false,
    isUserInfoUpdated: false,
    isUserProfileUpdated: false,
    resume_link: "",
    isRequestsToApproveFetched: false,
    isRequestApproved: false,
    isUserConnectionsFetched: false,
}




const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        },
        resetResumeLink: (state) => {
            state.resume_link = ""
        }
    },

    extraReducers: (builder) => {

        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Logging in the User!"
                };
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = {
                    message: "Login is Successful"
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Signing up the User!"
                }
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = {
                    message: "Signing up is Successful. Please log in"
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching user and its profile."
                }
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isSuccess = true;
                state.profileFetched = true;
                state.message = action.payload.message;
                state.user = action.payload.profile;
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching All Users"
                }
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isSuccess = true;
                state.allUsersFetched = true;
                state.message = action.payload.message;
                state.allUsers = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching User Profile..."
                }
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.userProfile = action.payload.profile;
                state.message = action.payload.message;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getAllUserPosts.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching All Posts Of a user"
                }
            })
            .addCase(getAllUserPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.userAllPosts = action.payload.posts;
                state.message = action.payload.message;
            })
            .addCase(getAllUserPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(AuthLikePost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Liking a Post"
                }
            })
            .addCase(AuthLikePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isLiked = true;
                state.message = action.payload.message;
            })
            .addCase(AuthLikePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(AuthDislikePost.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Disliking a Post"
                }
            })
            .addCase(AuthDislikePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isLiked = false;
                state.message = action.payload.message;
            })
            .addCase(AuthDislikePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getAllUserComments.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching All User Comments"
                }
            })
            .addCase(getAllUserComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.userAllComments = action.payload.comments;
                state.message = action.payload.message;
            })
            .addCase(getAllUserComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserProfilePicture.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Updating User Profile Picture"
                }
            })
            .addCase(updateUserProfilePicture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isProfileImageUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserProfilePicture.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserBannerImage.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Updating User Profile Picture"
                }
            })
            .addCase(updateUserBannerImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isBannerImageUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserBannerImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserDetails.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Updating User Info"
                }
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isUserInfoUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserProfileDetails.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Updating User Profile"
                }
            })
            .addCase(updateUserProfileDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.loggedIn = true;
                state.isUserProfileUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserProfileDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(updateProfileSectionBulk.fulfilled, (state, action) => {
                state.userProfile = action.payload.profile;
            })
            .addCase(addProfileSectionItem.fulfilled, (state, action) => {
                state.userProfile = action.payload.profile;
            })
            .addCase(deleteProfileSectionItem.fulfilled, (state, action) => {
                state.userProfile = action.payload.profile;
            })
            .addCase(download_resume.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Downloading the resume"
                }
            })
            .addCase(download_resume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.resume_link = action.payload.url;
                state.message = action.payload.message;
            })
            .addCase(download_resume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(sendConnectionRequest.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Sending Connection Request"
                }
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
            })
            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getConnectionRequestsToApprove.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching connection requests to approve"
                }
            })
            .addCase(getConnectionRequestsToApprove.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
                state.connectionRequests = action.payload.requests;
                state.isRequestsToApproveFetched = true;
            })
            .addCase(getConnectionRequestsToApprove.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(acceptConnectionRequest.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Accepting Connection Request"
                }
            })
            .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
                state.isRequestApproved = true;
            })
            .addCase(acceptConnectionRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(getUserConnections.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Fetching User Connections"
                }
            })
            .addCase(getUserConnections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
                state.connections = action.payload.connections;
                state.isUserConnectionsFetched = true;
            })
            .addCase(getUserConnections.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })
            .addCase(deletePostById.pending, (state) => {
                state.isLoading = true;
                state.message = {
                    message: "Deleting Post using its Id"
                }
            })
            .addCase(deletePostById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload.message;
                const deletedPostId = action.payload.postId;

                if (Array.isArray(state.userAllPosts)) {
                    state.userAllPosts = state.userAllPosts.filter((post) => post._id !== deletedPostId);
                }
            })
            .addCase(deletePostById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
            })


    }
});


export const { reset, handleLoginUser, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;