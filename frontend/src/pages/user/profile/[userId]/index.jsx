import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { deletePostById, download_resume, getAboutUser, getAllUserComments, getAllUserPosts, getAllUsers, getUserProfile, updateProfileSectionBulk, updateUserBannerImage, updateUserDetails, updateUserProfileDetails, updateUserProfilePicture } from '@/config/redux/action/authAction';
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar';
import { LuDot } from "react-icons/lu";
import { IoDiamondOutline } from "react-icons/io5";
import { MdLanguage } from "react-icons/md";
import { dislikePost, likePost } from '@/config/redux/action/postAction';

function Profile() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showBtnPosts, setShowBtnPosts] = useState({});
    const textRefs = useRef({});

    const [currentImage, setCurrentImage] = useState({});
    const [tab, setTab] = useState("posts");
    const [showContactInfo, setShowContactInfo] = useState(false);

    // User Profile Image Update States
    const [showImageUpdatePanel, setShowImageUpdatePanel] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");

    // Banner update states
    const [showBannerUpdatePanel, setShowBannerUpdatePanel] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerImagePreview, setBannerImagePreview] = useState("");


    const [currentUser, setCurrentUser] = useState("");


    // bio edit states
    const [showBioEditPanel, setShowBioEditPanel] = useState(false);
    const [showAboutEditPanel, setShowAboutEditPanel] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newCity, setNewCity] = useState("");
    const [newAbout, setNewAbout] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [topSkills, setTopSkills] = useState([]);
    const [newTopSkillInput, setNewTopSkillInput] = useState("");


    // edit sections states
    const [sectionType, setSectionType] = useState("");
    const [sectionData, setSectionData] = useState([]);
    const [showSectionModal, setShowSectionModal] = useState(false);



    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (router.query.userId) {
            dispatch(getUserProfile({ userId: router.query.userId }))
                .unwrap()
                .catch(() => {
                    router.replace("/404");
                });

            dispatch(getAllUserPosts({ userId: router.query.userId }));
            dispatch(getAllUserComments({ userId: router.query.userId }));
            dispatch(getAboutUser({ token: storedToken }));

        }
    }, [router.query.userId, authState.isLiked, authState.isProfileImageUpdated, authState.isBannerImageUpdated, authState.isTokenThere, authState.isUserInfoUpdated, authState.isUserProfileUpdated]);

    useEffect(() => {
        if (authState?.user) {
            setCurrentUser(authState?.user?.userId?._id);
            //console.log(currentUser);
        }
    });


    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        const newShowBtn = {};

        authState.userAllPosts.forEach((post) => {
            const el = textRefs.current[post._id];
            if (el) {
                newShowBtn[post._id] =
                    el.scrollHeight > el.clientHeight;
            }
        });

        setShowBtnPosts(newShowBtn);
    }, [authState.userAllPosts]);



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

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    }

    const handleProfileImageUpload = () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);


        dispatch(updateUserProfilePicture({ file: formData, token }));
        setShowImageUpdatePanel(false);
        setSelectedImage(null);
        setProfileImagePreview("");

    }


    const handleBannerChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedBanner(file);
            setBannerImagePreview(URL.createObjectURL(file));
        }
    }


    const handleBannerUpdate = () => {
        if (!selectedBanner) return;

        const formData = new FormData();
        formData.append("file", selectedBanner);

        dispatch(updateUserBannerImage({ file: formData, token }));
        setShowBannerUpdatePanel(false);
        setSelectedBanner(null);
        setBannerImagePreview("");

    }


    const handleUserInfoUpdation = () => {
        const data = { token };

        if (newName) data.name = newName;
        if (newEmail) data.email = newEmail;
        if (newUsername) data.username = newUsername;

        dispatch(updateUserDetails(data));
        setShowBioEditPanel(false);
        setNewName("");
        setNewEmail("");
        setNewUsername("");
    }


    const handleProfileUpdation = () => {
        const data = { token };

        if (newBio) data.bio = newBio;
        if (newCity) data.city = newCity;
        if (newAbout) data.about = newAbout;
        if (topSkills.length > 0) data.topSkills = topSkills;
        dispatch(updateUserProfileDetails(data));
        setShowBioEditPanel(false);
        setShowAboutEditPanel(false);
        setNewBio("");
        setNewCity("");
        setNewAbout("");
    }


    const handleAddTopSkill = () => {
        const value = newTopSkillInput.trim();

        if (!value) return;

        setTopSkills(prev => {
            if (prev.includes(value)) {
                alert("Skill Already Added!");
                return prev;
            }

            if (prev.length >= 5) {
                alert("Max 5 Skills Allowed");
                return prev;
            }

            return [...prev, value];
        });

        setNewTopSkillInput("");
    };

    const handleRemoveTopSkill = (index) => {
        setTopSkills(prev => prev.filter((_, i) => i !== index));
    };


    const handleOpenAboutPanel = () => {
        setShowAboutEditPanel(true);

        // clone from redux (IMPORTANT)
        setTopSkills([...(authState?.userProfile?.topSkills || [])]);
        setNewAbout(authState?.userProfile?.about || "");
    }


    const handleCloseAboutPanel = () => {
        setShowAboutEditPanel(false);

        // Reset local state from Redux (original data)
        setTopSkills([...(authState?.userProfile?.topSkills || [])]);
    }



    const handleAddSection = (type) => {
        setSectionType(type);

        // add new empty object 
        setSectionData([{}]);

        setShowSectionModal(true);
    };


    const handleEditSection = (type, data, isAddingNew = false) => {
        setSectionType(type);

        let finalData = data ? JSON.parse(JSON.stringify(data)) : [];

        if (isAddingNew) {
            let emptyRow = {};
            if (type === "experience") emptyRow = { company: "", position: "", years: "", mode: "onsite", location: "" };
            else if (type === "education") emptyRow = { school: "", degree: "", fieldOfStudy: "" };
            else if (type === "skills") emptyRow = { name: "", experienceGainedAt: "" };
            else if (type === "languages") emptyRow = { name: "", level: "Basic" };

            finalData.push(emptyRow);
        }

        else if (finalData.length === 0) {
            finalData = [{}];
        }

        setSectionData(finalData);
        setShowSectionModal(true);
    };


    const handleSectionChange = (index, field, value) => {
        setSectionData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };

    const handleAddField = () => {
        let emptyRow = {};
        if (sectionType === "experience") {
            emptyRow = { company: "", position: "", years: "", mode: "onsite", location: "" };
        } else if (sectionType === "education") {
            emptyRow = { school: "", degree: "", fieldOfStudy: "" };
        } else if (sectionType === "languages") {
            emptyRow = { name: "", level: "Basic" };
        } else if (sectionType === "skills") {
            emptyRow = { name: "", experienceGainedAt: "" };
        }
        setSectionData(prev => [...prev, emptyRow]);
    };

    const handleRemoveField = (index) => {
        setSectionData(prev => prev.filter((_, i) => i !== index));
    };


    const handleSaveSection = () => {
        // 1. Data Cleaning
        const cleanedData = sectionData
            .filter(item => {
                const hasMainContent = item.school || item.company || item.name;
                return hasMainContent && hasMainContent.trim() !== "";
            })
            .map(item => {
                if (sectionType === "experience" && (!item.mode || item.mode.trim() === "")) {
                    return { ...item, mode: "onsite" };
                }
                return item;
            });

        if (cleanedData.length === 0 && sectionData.length > 0) {
            alert("Please fill in the required fields.");
            return;
        }

        // 3. API Call
        dispatch(updateProfileSectionBulk({
            token,
            section: sectionType,
            data: cleanedData
        })).unwrap()
            .then(() => {
                setShowSectionModal(false);
            })
            .catch((err) => {
                console.error("Backend Error:", err);
                alert(`Error: ${err.message || "Something went wrong"}`);
            });
    };



    const handleDownloadResume = async (userId) => {
        try {
            const res = await dispatch(download_resume({ userId })).unwrap();
            if (res && res.url) {
                // open in new tab
                window.open(res.url, '_blank');
            } else {
                console.error("No Link in response");
            }

        } catch (err) {
            console.error("Failed to download:", err);
        }
    }


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
            //console.log(authState.user)
            setUserId(authState?.user?.userId?._id);


        }
    }, [authState.profileFetched]);


    const handlePostDeletion = (postId) => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        dispatch(deletePostById({ token: storedToken, postId }));
    }

    return (
        <>
            <DashboardNavbar />
            <div className='min-h-screen w-full bg-[#F4F2EE] px-4 md:px-10 lg:px-32 xl:px-72 pt-5 flex flex-col lg:flex-row gap-6'>
                <div className='w-full h-full overflow-y-auto hide-scrollbar'>
                    <div className='w-full min-h-140 xl:min-h-130 bg-white border-1 border-zinc-300 rounded-xl flex flex-col mb-2 shadow-md relative '>
                        <div className='flex relative'>
                            <img className='w-full h-55 rounded-t-xl ' src={authState?.userProfile?.userId?.bannerImage || "/banner_image.png"} />
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className='h-10 w-10 rounded-full bg-stone-100 border-1 border-white flex items-center justify-center shadow-md absolute right-5 top-3 '>

                                    <div className='cursor-pointer hover:scale-90 ' onClick={() => { setShowBannerUpdatePanel(true) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>

                                </div>
                            )}
                        </div>
                        {currentUser === authState?.userProfile?.userId?._id && (
                            <div className='cursor-pointer absolute right-8 top-1/2 hover:scale-90' onClick={() => { setShowBioEditPanel(true) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </div>
                        )}
                        <div className='h-45 w-35 relative left-8 -top-25'>
                            <img className='h-full w-full rounded-full border-3 border-white' src={authState?.userProfile?.userId?.profilePicture || "/default_profile.png"} />
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className='h-10 w-10 rounded-full bg-stone-200 border-2 border-white cursor-pointer flex items-center justify-center shadow-md absolute -right-2 top-30 '>
                                    <div className='cursor-pointer hover:scale-90 ' onClick={() => { setShowImageUpdatePanel(true) }} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='-mt-18 flex flex-col  px-10'>
                            <div className='text-2xl font-medium'>{authState?.userProfile?.userId?.name}</div>
                            <div className='w-2/3 text-md mt-1'>{authState?.userProfile?.bio}</div>
                            <div className='flex gap-1'>
                                <div className='text-sm text-zinc-500'>{authState?.userProfile?.city}</div>
                                <div className='flex text-zinc-500 '><LuDot /></div>
                                <div className='text-violet-600 text-sm cursor-pointer  hover:underline' onClick={() => { setShowContactInfo(true) }} >Contact info</div>
                            </div>
                            <div className='mt-5'>
                                <button
                                    className={`border border-blue-500 text-sm px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${authState?.isLoading ? 'bg-blue-100 cursor-not-allowed' : 'text-blue-500 cursor-pointer hover:scale-95 hover:bg-blue-100'}`}
                                    onClick={() => { !authState?.isLoading && handleDownloadResume(authState?.userProfile?.userId?._id) }}
                                    disabled={authState?.isLoading}
                                >
                                    {authState?.isLoading ? (
                                        //  Loading Spinner ---
                                        <svg className="animate-spin size-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        // --- Download Icon ---
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                    )}

                                    <span>{authState?.isLoading ? "Generating..." : "Download Resume"}</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {showBioEditPanel === true && (
                        <div className='absolute top-20 left-5 md:left-40 md:w-160 lg:left-50 lg:w-180  xl:left-100 h-130 w-[90%] xl:w-200 bg-white z-50 border border-zinc-500 xl:border-zinc-300 rounded-xl shadow-md flex flex-col justify-around'>
                            <div className='flex justify-between px-5 rounded-t-xl p-3'>
                                <div className='text-xl'>Edit Info</div>
                                <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setShowBioEditPanel(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='w-full h-50 px-4  flex flex-col gap-3'>
                                <div className='flex flex-col '>
                                    <label htmlFor="name" className='px-2 text-md'>Name</label>
                                    <input className='border xl:w-80 rounded-md px-2 outline-none' type="text" name="name" id="name" placeholder={authState?.userProfile?.userId?.name} value={newName} onChange={(e) => { setNewName(e.target.value) }} />
                                </div>
                                <div className='flex flex-col '>
                                    <label htmlFor="email" className='px-2 text-md'>Email</label>
                                    <input className='border xl:w-100 rounded-md px-2 outline-none' type="email" name="email" id="email" placeholder={authState?.userProfile?.userId?.email} value={newEmail} onChange={(e) => { setNewEmail(e.target.value) }} />
                                </div>
                                <div className='flex flex-col '>
                                    <label htmlFor="username" className='px-2 text-md'>Username</label>
                                    <input className='border xl:w-100 rounded-md px-2 outline-none' type="username" name="username" id="username" placeholder={authState?.userProfile?.userId?.username} value={newUsername} onChange={(e) => { setNewUsername(e.target.value) }} />
                                </div>
                                <div className='w-full min-h-15 mb-2  flex justify-between items-center' >
                                    <div className='w-[75%]  xl:w-160 border  bg-zinc-300'></div>
                                    <button className='border px-4 rounded-md py-1 cursor-pointer bg-white text-blue-500 font-medium hover:border-2' onClick={handleUserInfoUpdation} >Edit</button>
                                </div>
                            </div>
                            <div className='w-full h-50 p-4 flex flex-col gap-3'>
                                <div className='flex flex-col '>
                                    <label htmlFor="bio" className='px-2 text-md'>Bio</label>
                                    <input className='border min-w-80 rounded-md px-2 outline-none' type="text" name="bio" id="bio" placeholder={authState?.userProfile?.bio} value={newBio} onChange={(e) => { setNewBio(e.target.value) }} />
                                </div>
                                <div className='flex flex-col '>
                                    <label htmlFor="city" className='px-2 text-md'>City</label>
                                    <input className='border xl:w-100 rounded-md px-2 outline-none' type="text" name="city" id="city" placeholder={authState?.userProfile?.city} value={newCity} onChange={(e) => { setNewCity(e.target.value) }} />
                                </div>
                                <div className='w-full min-h-15 mb-2 p-2 flex justify-end items-center' >
                                    <button className='border px-4 rounded-md py-1 cursor-pointer bg-white text-blue-500 font-medium hover:border-2' onClick={handleProfileUpdation}  >Edit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showImageUpdatePanel === true && (
                        <div className='absolute top-20 left:5 md:left-40 md:w-160 lg:left-50 lg:w-180  xl:left-100 h-100 w-[92%] xl:w-200 bg-white z-50 border border-zinc-300 rounded-xl shadow-md flex flex-col'>
                            <div className='flex justify-between bg-zinc-100 rounded-t-xl  p-3'>
                                <div className='text-lg'>Update Profile Image</div>
                                <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setShowImageUpdatePanel(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='flex flex-col '>
                                <div className='flex flex-col items-center xl:flex-row justify-around px-2 gap-4 xl:px-20 py-5 '>
                                    <div className='h-40 w-40'>
                                        {profileImagePreview && (
                                            <img src={profileImagePreview} className="h-40 w-40 object-cover rounded-full mx-auto" />
                                        )}
                                    </div>
                                    <div className='border h-12 w-80 rounded-xl overflow-x-auto'>
                                        <input className='w-full h-10 py-2 px-2 cursor-pointer' name='file' type="file" accept='image/*' onChange={handleImageChange} />
                                    </div>
                                </div>

                                <div className='w-full justify-center xl:h-37 flex xl:justify-end gap-5 px-10 xl:items-end pb-8 '>
                                    <button className='w-25 border border-blue-500 px-4 py-2 text-blue-500 bg-white font-medium rounded-3xl hover:border-2 cursor-pointer ' onClick={handleProfileImageUpload} >Update</button>
                                    <button className=' w-25 border border-zinc-400 px-4 py-2 text-zinc-500 bg-white font-medium rounded-3xl hover:border-2 cursor-pointer ' onClick={() => { setShowImageUpdatePanel(false); setProfileImagePreview(""); setSelectedImage(null) }} >Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}



                    {showBannerUpdatePanel === true && (
                        <div className='absolute top-20 left-5 w-[90%] md:left-40 md:w-160 lg:left-50 lg:w-180  xl:left-100 h-100 xl:w-200 bg-white z-50 border border-zinc-300 rounded-xl shadow-md flex flex-col'>
                            <div className='flex justify-between rounded-t-xl  p-3'>
                                <div className='text-lg'>Update Banner Image</div>
                                <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setShowBannerUpdatePanel(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='flex flex-col '>
                                <div className='flex flex-col gap-4 px-2 xl:flex-row justify-around py-5 '>
                                    <div className='h-40 xl:w-90'>
                                        {bannerImagePreview && (
                                            <img src={bannerImagePreview} className="h-40 w-full object-cover rounded-xl mx-auto" />
                                        )}
                                    </div>
                                    <div className='border h-12 w-80 rounded-xl overflow-x-auto'>
                                        <input className='w-full h-10 py-2 px-2 cursor-pointer' name='file' type="file" accept='image/*' onChange={handleBannerChange} />
                                    </div>
                                </div>

                                <div className='w-full xl:h-37 flex justify-center xl:justify-end gap-5 px-10 xl:items-end xl:pb-8 '>
                                    <button className='w-25 border border-blue-500 px-4 py-2 text-blue-500 bg-white font-medium rounded-3xl hover:border-2 cursor-pointer ' onClick={handleBannerUpdate} >Update</button>
                                    <button className=' w-25 border border-zinc-400 px-4 py-2 text-zinc-500 bg-white font-medium rounded-3xl hover:border-2 cursor-pointer ' onClick={() => { setShowBannerUpdatePanel(false); setBannerImagePreview(""); setSelectedBanner(null) }} >Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}






                    {showContactInfo === true ?
                        <div className='absolute top-20 left-5 xl:left-100 w-[90%] h-100 md:left-40 md:w-160 xl:w-200 bg-white z-50 border border-zinc-300 rounded-xl shadow-md flex flex-col' >
                            <div className='flex justify-between bg-zinc-100 rounded-t-xl border-b border-zinc-400 p-3'>
                                <div className='text-lg'>Contact Info</div>
                                <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={() => { setShowContactInfo(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='flex flex-col justify-between h-87 p-4 pt-10 w-full '>
                                <div className='flex flex-col gap-10'>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <img className='h-9 w-auto' src="/Synapse_favicon.png" />
                                            <div className='text-md font-medium'>Your Profile</div>
                                        </div>
                                        <div className='text-md px-7 text-blue-500 cursor-pointer hover:underline overflow-y-scroll pb-2' onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/user/profile/${router.query.userId}` }} >{`${process.env.NEXT_PUBLIC_FRONTEND_URL}/user/profile/${router.query.userId}`}</div>
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                            </svg>
                                            <div className='text-md font-medium'>Email</div>
                                        </div>
                                        <div className='text-md px-7'>{authState?.userProfile?.userId?.email}</div>
                                    </div>
                                </div>

                                <div className='w-full h-15  flex justify-end pr-5 py-2'>
                                    <button className='border border-blue-500 h-full px-3 font-medium text-sm bg-white text-blue-500 rounded-xl cursor-pointer hover:border-2 hover:bg-blue-100' onClick={() => { setShowBioEditPanel(true); setShowContactInfo(false) }} >Edit Contact Info</button>
                                </div>
                            </div>
                        </div>
                        : null}




                    <div className='w-full min-h-130 bg-white border-1 border-zinc-300 rounded-xl p-5 mb-2 flex flex-col gap-2 shadow-md '>
                        <div className='flex justify-between mb-2'>
                            <div className='text-lg font-medium'>About</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className='cursor-pointer hover:scale-90 ' onClick={handleOpenAboutPanel} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {authState?.userProfile?.about?.length > 0 ?
                            <div className='text-sm whitespace-pre-wrap h-80 overflow-y-scroll'>
                                {authState?.userProfile?.about}
                            </div>
                            : null}


                        <div className='w-full min-h-20 bg-white relative py-2 mt-2 border-2 border-zinc-300 rounded-xl flex flex-col justify-center px-4'>
                            <div className='flex gap-4 items-center'>
                                <div>
                                    <IoDiamondOutline className='text-3xl' />
                                </div>
                                <div className='text-md font-medium'>Top Skills</div>
                            </div>
                            {authState?.userProfile?.topSkills?.length > 0 && (
                                <div className='flex flex-wrap gap-5 px-10'>
                                    {authState?.userProfile?.topSkills?.map((skill, index) => (
                                        <div key={index}>
                                            <div className='flex items-center text-md '><LuDot className='text-zinc-500' />{skill}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>


                    {showAboutEditPanel === true && (
                        <div className='absolute top-20 xl:left-100 h-150 w-[90%] md:w-180 xl:w-200 bg-white z-50 border border-zinc-300 rounded-xl shadow-md flex flex-col '>
                            <div className='flex justify-between px-5 rounded-t-xl p-3'>
                                <div className='text-xl'>Edit Info</div>
                                <div className='opacity-70 cursor-pointer hover:opacity-100' onClick={handleCloseAboutPanel}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='w-full h-full  p-5 flex flex-col justify-between'>
                                <textarea className='w-full h-50 border rounded-xl p-4 outline-none' placeholder={authState?.userProfile?.about} name="about" id="about" value={newAbout} onChange={(e) => { setNewAbout(e.target.value) }}  ></textarea>
                                <div className='w-full h-40  px-2 py-5'>
                                    <div className='flex flex-wrap gap-2 mb-4'>
                                        {topSkills?.map((skill, index) => (
                                            <div key={index} className='flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full'>
                                                <span>{skill}</span>
                                                <button onClick={() => { handleRemoveTopSkill(index) }} className='text-red-500 font-bold cursor-pointer' >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type="text" value={newTopSkillInput} onChange={(e) => { setNewTopSkillInput(e.target.value) }} onKeyDown={(e) => e.key === "Enter" && handleAddTopSkill()} placeholder='Add a Skill' className="border px-2 py-1 rounded-md w-full outline-none" />
                                        <button className="bg-blue-500 text-white px-3 rounded-md cursor-pointer hover:scale-90" onClick={handleAddTopSkill}>Add</button>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">
                                        {topSkills?.length}/5 skills added
                                    </div>
                                </div>
                                <div className='w-full min-h-15 mb-2 p-2 flex justify-end items-center  ' >
                                    <button className='border px-4 rounded-md py-1 cursor-pointer bg-white text-blue-500 font-medium hover:border-2 hover:bg-blue-100' onClick={handleProfileUpdation}  >Edit</button>
                                </div>
                            </div>

                        </div>
                    )}










                    <div className='w-full min-h-125 bg-white border-1 mb-2 border-zinc-300 rounded-xl p-5  flex flex-col shadow-md' >
                        <div className='flex justify-between mb-4 h-10'>
                            <div className='text-lg font-medium'>Activity</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className=' flex gap-8 '>
                                    <button className='border hover:border-2 hover:bg-sky-100 border-blue-500 text-xs font-medium px-3 cursor-pointer bg-white text-blue-500 p-2 rounded-full ' onClick={() => { router.push("/dashboard") }} >Create a Post</button>
                                </div>
                            )}
                        </div>
                        <div className='w-full flex gap-3 mb-4 p-2'>
                            <button className={`${tab === "posts" ? "bg-[#01754F] text-white " : "border-1 border-zinc-300 bg-white text-gray-700"}  p-1.5 px-3 text-sm cursor-pointer  rounded-full`} onClick={() => { setTab("posts") }} >Posts</button>
                            <button className={`${tab === "comments" ? "bg-[#01754F] text-white " : "border-1 border-zinc-300 bg-white text-gray-700"}  p-1.5 px-3 text-sm cursor-pointer  rounded-full`} onClick={() => { setTab("comments") }} >Comments</button>
                        </div>
                        {authState?.userAllPosts?.length > 0 ? (tab === "posts" && (
                            <div className='w-full min-h-125 bg-white  rounded-xl overflow-x-scroll flex gap-4'>
                                {authState?.userAllPosts?.map((post) => (
                                    <div className='h-full min-w-90 border border-zinc-300 rounded-xl shadow-xs py-2  mb-2 ' key={post._id} >
                                        <div className='h-15 w-full flex items-center gap-2 px-2 ' >
                                            <img className='w-12 h-15 rounded-full ' src={post?.userId?.profilePicture || "/default_profile.png"} />
                                            <div className='w-full flex justify-between'>
                                                <div>
                                                    <div className='text-md  cursor-pointer hover:underline hover:text-blue-500' onClick={() => { router.push(`/post/${post._id}`) }}>{post?.userId?.name}</div>
                                                    <div className='text-xs text-zinc-500'>username: {post?.userId?.username}</div>
                                                </div>
                                                {userId === post.userId._id && (
                                                    <div className='h-10 flex items-center cursor-pointer pr-2 text-red-500 hover:scale-90' onClick={() => { handlePostDeletion(post._id) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`${post.body.length < 129 ? "mb-5" : ""} px-4 min-h-20 py-1 w-full`} >
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
                                                    className="w-full h-[200px] object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* images */}
                                        {post.postType !== "video" && post.media?.length > 0 && (
                                            <div className="w-full mt-2">
                                                {post.media.length === 1 && (
                                                    <img
                                                        src={post.media[0].url}
                                                        className="w-full h-[200px] object-cover"
                                                    />
                                                )}

                                                {post.media.length === 2 && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {post.media.map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img.url}
                                                                className="w-full h-[200px] object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* carousel */}
                                                {post.media.length > 2 && (
                                                    <div className="relative">
                                                        <img
                                                            src={post.media[currentImage[post._id] || 0].url}
                                                            className="w-full h-[200px] object-cover"
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
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                                                    <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
                                                </svg>
                                                <div>{post.likes}</div>
                                            </div>
                                        </div>
                                        <div className='w-full h-15  px-8 flex items-center justify-between border-t'>
                                            <div className={`flex gap-2 cursor-pointer ${post.isUserLiked ? "text-blue-500" : "hover:text-blue-500"} `} onClick={() => { handleLike(post._id, post.isUserLiked) }} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                                </svg>
                                                <div className='text-sm'>Like</div>
                                            </div>
                                            <div className="flex gap-2 cursor-pointer hover:text-blue-500" onClick={() => { router.push(`/post/${post._id}`) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                </svg>
                                                <div className='text-sm'>Comment</div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>)
                        ) : (tab === "posts" && (
                            <div className='w-full h-100 bg-white border border-zinc-300 rounded-xl flex items-center justify-center'>
                                <div className='flex flex-col items-center gap-3 pb-20'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                    </svg>
                                    <div className='text-xl'>No Posts yet</div>
                                    <p>Share your perspective, moments, or ideas with your network.</p>
                                </div>
                            </div>
                        )
                        )}


                        {authState?.userAllComments?.length > 0 ? (tab === "comments" && (
                            <div className='w-full h-120 bg-white  rounded-xl flex flex-col gap-2 p-2 px-3 overflow-y-scroll'>
                                {authState?.userAllComments?.map((comment) => (
                                    <div className='w-full min-h-20 xl:min-h-18 border border-zinc-300 rounded-md p-2 flex flex-col gap-3' key={comment._id}>
                                        <div className='text-xs text-zinc-600 cursor-pointer hover:underline hover:text-blue-500' onClick={() => { router.push(`/post/${comment?.postId}`) }} >{comment?.userId?.name} commented on a post</div>
                                        <div className='text-sm'>{comment.body}</div>
                                    </div>
                                ))}
                            </div>
                        )) : (tab === "comments" && (
                            <div className='w-full h-100 bg-white border border-zinc-300 rounded-xl flex items-center justify-center'>
                                <div className='flex flex-col items-center gap-3 pb-20'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <div className='text-xl'>No Comments yet</div>
                                    <p>Share your perspective, moments, or ideas with your network.</p>
                                </div>
                            </div>
                        )
                        )}
                    </div>








                    <div className='w-full min-h-60 bg-white border-1 border-zinc-300 rounded-xl p-5 mb-2 flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between mb-4'>
                            <div className='text-lg font-medium'>Experience</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className=' flex gap-8 '>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("experience", authState?.userProfile?.experience, true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("experience", authState?.userProfile?.experience)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {authState?.userProfile?.experience?.length > 0 && (
                            <div className='w-full h-full'>
                                {
                                    authState?.userProfile?.experience?.map((exp, index) => (
                                        <div className='flex gap-2 h-30 w-full mb-4' key={index}>
                                            <div className='h-full w-15'>
                                                <div className='h-15 rounded-lg w-full bg-[#F4F2EE] flex'>
                                                    <div className='bg-slate-300 h-13 relative left-6 top-2 bottom-0 w-6'></div>
                                                    <div className='bg-slate-400 h-6 w-3 relative top-9 right-3'></div>
                                                    <div className='bg-slate-500 h-6 w-4 relative top-9 right-3'></div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='text-md'>{exp.company}</div>
                                                <div className='text-sm'>{exp.position}</div>
                                                <div className='text-zinc-600 text-sm'>{exp.years} years</div>
                                                <div className='flex gap-2'>
                                                    <div className='text-zinc-600 text-sm'>{exp.location}</div>
                                                    <div className='flex items-center text-zinc-600'>
                                                        <div className='flex text-zinc-500 text-sm'><LuDot /></div>
                                                        <div className='text-sm'>{exp.mode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>




                    <div className='w-full min-h-60 bg-white border-1 border-zinc-300 rounded-xl p-5 mb-2 flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between '>
                            <div className='text-lg font-medium'>Education</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className=' flex gap-8 '>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("education", authState?.userProfile?.education, true)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("education", authState?.userProfile?.education)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {authState?.userProfile?.education?.length > 0 && (
                            <div className='w-full h-full'>
                                {
                                    authState?.userProfile?.education?.map((edu, index) => (
                                        <div className='flex gap-2 h-30 w-full ' key={index}>
                                            <div className='h-full w-15'>
                                                <div className='h-15 rounded-lg w-full bg-[#F4F2EE] flex justify-end items-center relative pr-2'>
                                                    <div className='h-5 w-5 rounded-full bg-slate-400 absolute z-50 top-1/2 right-1/2 shadow-sm'></div>
                                                    <div className='h-9 w-9 rounded-full bg-slate-300 z-40'></div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='text-md'>{edu.school}</div>
                                                <div className='text-sm'>{edu.degree}</div>
                                                <div className='text-zinc-600 text-sm'>{edu.fieldOfStudy}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>



                    <div className='w-full min-h-60 bg-white border-1 border-zinc-300 rounded-xl p-5 mb-2 flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between '>
                            <div className='text-lg font-medium'>Skills</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className=' flex gap-8 '>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("skills", authState?.userProfile?.skills, true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("skills", authState?.userProfile?.skills)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {authState?.userProfile?.skills?.length > 0 && (
                            <div className='w-full h-full mt-5'>
                                {
                                    authState?.userProfile?.skills?.map((skill, index) => (
                                        <div className='flex h-15 w-full  mb-4' key={index}>
                                            <div className='h-full w-15'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                                </svg>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='text-md'>{skill.name}</div>
                                                <div className='text-md text-sm text-zinc-500'>{skill.experienceGainedAt}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>


                    <div className='w-full min-h-50 bg-white border-1 border-zinc-300 rounded-xl p-5 lg:mb-80 flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between '>
                            <div className='text-lg font-medium'>Languages</div>
                            {currentUser === authState?.userProfile?.userId?._id && (
                                <div className=' flex gap-8 '>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("languages", authState?.userProfile?.languages, true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <div className='cursor-pointer hover:scale-90' onClick={() => handleEditSection("languages", authState?.userProfile?.languages)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {authState?.userProfile?.languages?.length > 0 && (
                            <div className='w-full h-full mt-5 '>
                                {
                                    authState?.userProfile?.languages?.map((lang, index) => (
                                        <div className='flex  h-12 w-full  mb-4' key={index}>
                                            <div className='h-full w-15'>
                                                <MdLanguage className='text-2xl' />
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='text-md'>{lang.name}</div>
                                                <div className='text-xs text-zinc-500'>{lang.level}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>


                    {showSectionModal && (
                        <div className="fixed top-15 left-5 w-[90%] md:w-150 md:left-30 lg:left-80 lg:w-160 xl:left-100 bg-white p-5 xl:w-200 h-180 border rounded-xl shadow-lg z-50 overflow-y-scroll">

                            <h2 className="text-xl mb-4 capitalize">{sectionType}</h2>

                            {sectionData.map((item, index) => (
                                <div key={index} className="mb-4 border p-3 rounded-md">

                                    {/* EDUCATION */}
                                    {sectionType === "education" && (
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <label className='text-xs'>School/University</label>
                                            <input placeholder="School/University"
                                                value={item.school || ""}
                                                onChange={(e) => handleSectionChange(index, "school", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Degree</label>
                                            <input placeholder="Degree"
                                                value={item.degree || ""}
                                                onChange={(e) => handleSectionChange(index, "degree", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Field of Study</label>
                                            <input placeholder="Field of Study"
                                                value={item.fieldOfStudy || ""}
                                                onChange={(e) => handleSectionChange(index, "fieldOfStudy", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                        </div>
                                    )}

                                    {/* EXPERIENCE */}
                                    {sectionType === "experience" && (
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <label className='text-xs'>Company</label>
                                            <input placeholder="Company"
                                                value={item.company || ""}
                                                onChange={(e) => handleSectionChange(index, "company", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Position</label>
                                            <input placeholder="Position"
                                                value={item.position || ""}
                                                onChange={(e) => handleSectionChange(index, "position", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Duration(Years)</label>
                                            <input placeholder="years"
                                                value={item.years || ""}
                                                onChange={(e) => handleSectionChange(index, "years", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Work Mode</label>
                                            <select value={item.mode || "onsite"} onChange={(e) => handleSectionChange(index, "mode", e.target.value)} className='border p-2 rounded bg-white'>
                                                <option value="onsite">Onsite</option>
                                                <option value="remote">Remote</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                            <label className='text-xs'>Location</label>
                                            <input placeholder="location"
                                                value={item.location || ""}
                                                onChange={(e) => handleSectionChange(index, "location", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                        </div>
                                    )}

                                    {/* LANGUAGES */}
                                    {sectionType === "languages" && (
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <label className='text-xs'>Language</label>
                                            <input placeholder="Language"
                                                value={item.name || ""}
                                                onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                                                className='border px-2 py-1 rounded-md'
                                            />
                                            <label className='text-xs'>Proficiency</label>
                                            <select
                                                value={item.level || ""}
                                                onChange={(e) =>
                                                    handleSectionChange(index, "level", e.target.value)
                                                }
                                                className='border px-2 py-1 rounded-md bg-white'
                                            >
                                                <option value="">Select Level</option>
                                                <option value="Basic">Basic</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Fluent">Fluent</option>
                                                <option value="Native">Native</option>
                                            </select>
                                        </div>

                                    )}

                                    {/* --- SKILLS --- */}
                                    {sectionType === "skills" && (
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <label className='text-xs '>Skill Name</label>
                                            <input
                                                value={item.name || ""}
                                                onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                                                className='border p-2 rounded bg-white'
                                                placeholder="Ex: React JS"
                                            />
                                            <label className='text-xs '>Gained At (Optional)</label>
                                            <input
                                                value={item.experienceGainedAt || ""}
                                                onChange={(e) => handleSectionChange(index, "experienceGainedAt", e.target.value)}
                                                className='border p-2 rounded bg-white'
                                                placeholder="Ex: Internship or Project"
                                            />
                                        </div>
                                    )}

                                    <button className='cursor-pointer border p-1 text-sm border-blue-500 rounded-xl text-blue-500 px-2 hover:bg-blue-100' onClick={() => handleRemoveField(index)}>Remove</button>
                                </div>
                            ))}

                            <button onClick={handleAddField}>+ Add More</button>

                            <div className="flex justify-end gap-4 mt-4">
                                <button className='cursor-pointer' onClick={() => setShowSectionModal(false)}>Cancel</button>
                                <button className='cursor-pointer' onClick={handleSaveSection}>Save</button>
                            </div>
                        </div>
                    )}



                </div >
                <div className=' h-full lg:w-110 '>
                    <div className='h-50 w-full bg-white border border-zinc-300 rounded-3xl p-6 flex flex-col gap-5 shadow-md'>
                        <div>Public profile and URL</div>
                        <textarea className='h-full w-full text-sm hide-scrollbar' disabled value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/user/profile/${router.query.userId}`}></textarea>
                    </div>
                    <div className='w-full h-20 rounded-lg  bg-transparent flex mt-2 pl-3 gap-1'>
                        <img className='h-10 w-25' src="/Synapse_logo.png" />
                        <div className='text-xs mt-2.5'>Synapse Corporations &copy;2026</div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Profile;