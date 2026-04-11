import { createNewPost } from '@/config/redux/action/postAction';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function CreatePost({ profilePicture, name }) {
    const postState = useSelector((state) => state.posts);
    const [token, setToken] = useState("");
    const dispatch = useDispatch();

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [body, setBody] = useState("");
    const [imagesPreviewTab, setImagesPreviewTab] = useState(false);
    const [videoPreviewTab, setVideoPreviewTab] = useState(false);
    const [openBodyEditor, setOpenBodyEditor] = useState(false);
    const [discardDialog, setDiscardDialog] = useState(false);

    useEffect(() => {
        const storedToken = (localStorage.getItem("token"));
        setToken(storedToken);

    }, [postState.loggedIn]);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("Max 5 images allowed");
            return;
        }

        setImages(files);
        setVideo(null);
    }

    const handleVideo = (e) => {
        const file = e.target.files[0];
        setVideo(file);
        setImages([]);
    }


    const removeImage = (index) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
    }

    const handlePostCreation = () => {
        if (postState.loggedIn && token) {
            dispatch(createNewPost({ token, body, images, video }));
        }
        setImages([]);
        setVideo(null);
        setBody("");
        setVideoPreviewTab(false);
        setImagesPreviewTab(false);
        setOpenBodyEditor(false);
    }

    const handleDiscardChanges = () => {
        setDiscardDialog(false);
        setOpenBodyEditor(false);
        setImages([]);
        setVideo(null);
        setImagesPreviewTab(false);
        setVideoPreviewTab(false);
    }

    return (
        <>
            <div className='h-35 w-full bg-white border border-zinc-300 rounded-xl p-2 shadow-sm'>
                <div className='flex items-center gap-3 relative '>
                    <img className='h-20 w-18 rounded-full border border-3 border-white bg-cover' src={profilePicture || "/default_profile.png"} alt="" />
                    <input className='border border-zinc-400 w-full p-3 rounded-3xl cursor-pointer' type="text" placeholder='Start a post' readOnly onClick={() => { setOpenBodyEditor(true) }} />
                </div>
                <div className='flex items-center justify-around px-8'>
                    <label >
                        <span className='flex gap-1 cursor-pointer hover:bg-zinc-100 px-3 py-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>Video
                        </span>
                        <input type='file' accept='video/*' className='hidden' onClick={() => { setVideoPreviewTab(true) }} onChange={handleVideo} />
                    </label>
                    <label>
                        <span className='flex gap-1 cursor-pointer hover:bg-zinc-100 px-3 py-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            Photo
                        </span>
                        <input type="file" accept='image/*' className='hidden' onClick={() => { setImagesPreviewTab(true) }} onChange={handleImages} multiple />
                    </label>
                </div>




                {imagesPreviewTab === true ?
                    <div className='absolute top-20 xl:top-30 left-5 w-[90%] xl:left-100 min-h-150 xl:w-200 bg-white z-40 border border-zinc-300 rounded-3xl p-5 flex flex-col gap-2 justify-around' >
                        <div className='flex justify-end'>
                            <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setImages([]); setImagesPreviewTab(false) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex gap-8 flex-wrap relative min-h-100'>
                            {images.length > 0 ?
                                (images.map((img, index) => (
                                    <div key={index} className='relative'>
                                        <img src={URL.createObjectURL(img)} className='w-50 h-50 object-cover rounded-lg' />
                                        <div className='h-8 w-8 rounded-full bg-zinc-300 z-50 absolute -top-2 left-45'>
                                            <button onClick={() => { removeImage(index) }} className="relative top-1 left-1 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )))
                                : null}
                        </div>
                        <div className='w-full h-10 flex justify-end '>
                            <button className='border border-zinc-300 h-full px-8 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-400' onClick={() => { setOpenBodyEditor(true); setImagesPreviewTab(false) }} >Next</button>
                        </div>
                    </div>
                    : null}






                {videoPreviewTab === true ?
                    <div className='absolute top-20 left-5 w-[90%]  md:top-25 md:left-30 md:w-150  xl:top-30 xl:left-100 min-h-150 xl:w-200 bg-white z-40 border border-zinc-300 rounded-3xl p-5 flex flex-col gap-2 justify-around'>
                        <div className='flex justify-end'>
                            <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setVideo(null); setVideoPreviewTab(false); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex gap-8 flex-wrap relative min-h-100'>
                            <div>
                                {video && (<video src={URL.createObjectURL(video)} controls className="w-full rounded-xl max-h-[400px] object-contain bg-black"></video>)}
                            </div>
                        </div>
                        <div className='w-full flex justify-end h-10 '>
                            <button className='border border-zinc-300 h-full px-8 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-400' onClick={() => { setOpenBodyEditor(true); setVideoPreviewTab(false); }}>Next</button>
                        </div>
                    </div>
                    : null}






                {openBodyEditor === true ?
                    <div className='absolute top-15 left-5 w-[90%] sm:left-30 sm:w-140 md:left-40 md:w-160 xl:left-100 h-150 xl:w-200 bg-white z-40 border border-zinc-300 rounded-3xl p-5 flex flex-col gap-2'>
                        <div className='flex justify-between mb-2 relative'>
                            <div className='flex items-center gap-8 px-2 rounded-xl cursor-pointer  hover:bg-zinc-200 h-30'>
                                <div className='h-20 w-20 rounded-full flex items-center'>
                                    <img className='rounded-full' src={profilePicture} />
                                </div>
                                <div className='text-2xl pb-7 font-medium '>
                                    {name}
                                </div>
                            </div>
                            <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { body.length > 0 || images.length > 0 || video ? setDiscardDialog(true) : setOpenBodyEditor(false) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                            {discardDialog === true ?
                                <div className='absolute top-30 left-60 w-70 h-40 border-1 border-zinc-300 rounded-2xl bg-white z-50 shadow-sm'>
                                    <div className='flex items-center justify-between border-b p-2 px-3'>
                                        <div className='text-lg'>Discard Changes</div>
                                        <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setDiscardDialog(false) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='px-3 mb-2'>It will remove the content of your post.</div>
                                    <div className='flex items-end h-10 justify-end px-4'>
                                        <button className='border border-zinc-300 h-10 px-8 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-400' onClick={handleDiscardChanges} >discard</button>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className='w-full h-75 mb-2 overflow-y'>
                            <textarea className='w-full h-full text-lg px-3 outline-none' name="body" id="body" placeholder='What do you want to talk about?' value={body} onChange={(e) => { setBody(e.target.value) }} />
                        </div>
                        <div className='flex items-center justify-between mt-2 h-30 '>
                            <div className='h-20 px-2'>
                                {video && (<video src={URL.createObjectURL(video)} controls className="w-full h-full rounded-xl object-contain"></video>)}
                            </div>
                            <div className='flex gap-4  w-full '>
                                {images.length > 0 ?
                                    (images.map((img, index) => (
                                        <div key={index} className='relative flex'>
                                            <img src={URL.createObjectURL(img)} className='w-25 h-25 object-cover rounded-lg' />
                                            <div className='h-6 w-6 rounded-full bg-zinc-300 z-50 absolute flex items-center pl-0.5'>
                                                <button onClick={() => { removeImage(index) }} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )))
                                    : null}
                            </div>
                            <div className='h-10'>
                                <button className='border border-zinc-300 h-full px-8 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-400' onClick={() => { if (images.length > 0 || video) { handlePostCreation() } }} >Post</button>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </>
    )
}

export default CreatePost;