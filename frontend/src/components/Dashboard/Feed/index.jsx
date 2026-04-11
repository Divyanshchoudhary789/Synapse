import { getAboutUser } from '@/config/redux/action/authAction';
import { createNewComment, deleteCommentById, dislikePost, getAllCommentsForAPost, getAllPosts, likePost } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Feed({ userPicture }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const postState = useSelector((state) => state.posts);
    const authState = useSelector((state) => state.auth);

    const [token, setToken] = useState("");
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showBtnPosts, setShowBtnPosts] = useState({});
    const textRefs = useRef({});

    const [currentImage, setCurrentImage] = useState({});
    const [showCommentCreation, setShowCommentCreation] = useState({});

    const [newCommentBody, setNewCommentBody] = useState({});
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        if (storedToken) {
            dispatch(getAllPosts({ token: storedToken }));
        }
    }, [postState.isLiked]);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
            //console.log(authState.user)
            setUserId(authState?.user?.userId?._id);

        }
    }, [authState.profileFetched]);


    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        const newShowBtn = {};

        postState.posts.forEach((post) => {
            const el = textRefs.current[post._id];
            if (el) {
                newShowBtn[post._id] =
                    el.scrollHeight > el.clientHeight;
            }
        });

        setShowBtnPosts(newShowBtn);
    }, [postState.posts]);



    const nextImage = (postId, length) => {
        setCurrentImage(prev => ({
            ...prev,
            [postId]: ((prev[postId] || 0) + 1) % length
        }));
    };

    const prevImage = (postId, length) => {
        setCurrentImage(prev => ({
            ...prev,
            [postId]: ((prev[postId] || 0) - 1 + length) % length
        }));
    };

    const handleLike = (postId, isUserLiked) => {
        if (!isUserLiked) {
            dispatch(likePost({ postId, token }));
        } else {
            dispatch(dislikePost({ postId, token }));
        }
    }


    const handleCommentCreation = (postId) => {
        const comment = newCommentBody[postId];

        if (comment?.length > 0) {
            dispatch(createNewComment({ token, postId, body: comment }));

            setNewCommentBody(prev => ({
                ...prev,
                [postId]: ""
            }));

            setShowCommentCreation(prev => ({
                ...prev,
                [postId]: false
            }));
        }
    };


    const handleCommentToggle = (postId) => {
        setShowCommentCreation(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));

        dispatch(getAllCommentsForAPost({ postId }));
    };


    const handleCommentDeletion = (commentId) => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        dispatch(deleteCommentById({ token: storedToken, commentId }));
    }

    return (
        <>
            <div className='h-full w-full'>
                {postState.posts.length > 0 ?
                    (
                        postState.posts.map((post) => (
                            <div key={post._id} className='w-full min-h-120 bg-white border border-zinc-300 rounded-xl mb-2 py-2 shadow-sm' >
                                <div className='w-full h-15 cursor-pointer  flex gap-3 px-4' onClick={() => { router.push(`/user/profile/${post?.userId?._id}`) }} >
                                    <div className='p-1 h-12 w-12 rounded-full'>
                                        <img className='rounded-full' src={post.userId.profilePicture || "/default_profile.png"} />
                                    </div>
                                    <div className='flex flex-col justify-center'>
                                        <div className='text-lg cursor-pointer hover:underline hover:text-blue-500'>{post.userId.name}</div>
                                        <div className='text-xs'>username: {post.userId.username}</div>
                                    </div>
                                </div>
                                <div className='px-4 py-1 w-full'>
                                    <p ref={(el) => (textRefs.current[post._id] = el)} className={`${expandedPosts[post._id] ? "" : "line-clamp-3"} whitespace-pre-wrap text-sm leading-5`} >{post.body}</p>
                                    {showBtnPosts[post._id] && (
                                        <span
                                            className='text-gray-500 cursor-pointer text-sm font-semibold hover:text-gray-600'
                                            onClick={() => toggleExpand(post._id)}
                                        >
                                            {expandedPosts[post._id] ? "See less" : "...see more"}
                                        </span>
                                    )}
                                </div>

                                {/* video */}
                                {post.postType === "video" && (
                                    <div className="w-full mt-2">
                                        <video
                                            src={post.media[0].url}
                                            controls
                                            className="w-full h-[400px] object-cover"
                                        />
                                    </div>
                                )}

                                {/* images */}
                                {post.postType !== "video" && post.media?.length > 0 && (
                                    <div className="w-full mt-2">
                                        {post.media.length === 1 && (
                                            <img
                                                src={post.media[0].url}
                                                className="w-full h-[400px] object-cover"
                                            />
                                        )}

                                        {post.media.length === 2 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {post.media.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img.url}
                                                        className="w-full h-[300px] object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* carousel */}
                                        {post.media.length > 2 && (
                                            <div className="relative">
                                                <img
                                                    src={post.media[currentImage[post._id] || 0].url}
                                                    className="w-full h-[400px] object-cover"
                                                />

                                                <button
                                                    onClick={() => prevImage(post._id, post.media.length)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                    </svg>

                                                </button>

                                                <button
                                                    onClick={() => nextImage(post._id, post.media.length)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>

                                                </button>

                                                <div className="flex justify-center gap-1 mt-2">
                                                    {post.media.map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className={`h-2 w-2 rounded-full ${(currentImage[post._id] || 0) === index
                                                                ? "bg-black"
                                                                : "bg-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className='flex px-10 items-end w-full h-8 mt-4'>
                                    <div className='flex gap-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
                                        </svg>
                                        <div>{post.likes}</div>
                                    </div>
                                </div>
                                <div className='w-full h-15  px-8 flex items-center justify-between border-t'>
                                    <div className={`flex gap-2 cursor-pointer ${post.isUserLiked ? "text-blue-500" : "hover:text-blue-500"} `} onClick={() => { handleLike(post._id, post.isUserLiked) }} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                        </svg>
                                        <div>Like</div>
                                    </div>
                                    <div className={`${showCommentCreation[post._id] ? "text-blue-500" : "hover:text-blue-500"} flex gap-2 cursor-pointer`} onClick={() => { handleCommentToggle(post._id) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        <div>Comment</div>
                                    </div>
                                </div>
                                {showCommentCreation[post._id] && (
                                    <div className='flex flex-col gap-2 mb-2'>
                                        <div className={`${newCommentBody[post._id]?.length > 0 ? "h-30  " : ""} w-full h-20 p-2 px-8 flex gap-2 mb-4`}>
                                            <img className='h-15 rounded-full' src={userPicture} />
                                            <div className={`${newCommentBody[post._id]?.length > 0 ? "h-30 rounded-xl border border-zinc-300 flex flex-col gap-2" : "h-10 mt-2 rounded-xl border-1 border-zinc-300"} w-full`}>
                                                <textarea className=" h-22 w-full rounded-xl p-1.5 px-4 hide-scrollbar outline-none" type="text" value={newCommentBody[post._id] || ""} onChange={(e) => { setNewCommentBody(prev => ({ ...prev, [post._id]: e.target.value })) }} />
                                                {newCommentBody[post._id]?.length > 0 && (<div className='h-8  bg-white-200 flex justify-end items-end mb-1 mr-2'>
                                                    <button className='border border-zinc-300 h-8 px-2 text-sm bg-[#0A66C2] text-white rounded-xl cursor-pointer hover:bg-blue-400' onClick={() => { handleCommentCreation(post._id) }}>Comment</button>
                                                </div>)}
                                            </div>
                                        </div>
                                        {postState.comments[post._id]?.length > 0 && (
                                            <div className='h-80 overflow-y-auto mr-2'>
                                                {postState.comments[post._id]?.map((comment) => {
                                                    if (!comment) return null;
                                                    return (
                                                        <div className='flex flex-col px-8 mb-4' key={comment._id}>
                                                            <div className='flex gap-4 cursor-pointer'>
                                                                <img className='h-15 rounded-full ' src={comment.userId.profilePicture || "/default_profile.png"} />
                                                                <div className='h-full w-full flex justify-between'>
                                                                    <div className='mt-1'>
                                                                        <div className='hover:underline hover:text-blue-500' onClick={() => { router.push(`/user/profile/${comment?.userId?._id}`) }} >{comment.userId?.name}</div>
                                                                        <div className='text-xs'>username: {comment.userId?.username}</div>
                                                                    </div>
                                                                    {userId === comment.userId._id && (
                                                                        <div className='h-10 flex items-center hover:scale-90' onClick={() => { handleCommentDeletion(comment._id) }}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className='px-15 cursor-default '>{comment.body}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))
                    ) : (
                        <div className='w-full h-120 bg-white border border-zinc-300 rounded-xl flex items-center justify-center'>
                            <div className='flex flex-col items-center gap-3 pb-20'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                </svg>
                                <div className='text-xl'>No Posts yet</div>
                                <p>Share your perspective, moments, or ideas with your network.</p>
                            </div>
                        </div>
                    )}
            </div >
        </>
    )
}

export default Feed;