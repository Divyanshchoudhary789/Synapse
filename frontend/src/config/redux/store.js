import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/authReducer";
import postReducer from "@/config/redux/reducer/postReducer";

/* 
    Steps to follow for the redux logic --> Steps for State Management
    1.Submit Action
    2.Handle action in it's reducer
    3.add reducer to the store means here.

*/



export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    },
});