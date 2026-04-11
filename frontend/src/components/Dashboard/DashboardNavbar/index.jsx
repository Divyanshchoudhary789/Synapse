import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';

function DashboardNavbar() {
    const router = useRouter();

    const path = router.asPath;
    const currentPage = path.split("/")[1];

    const panelRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsTab, setSearchResultsTab] = useState(false);
    const [token, setToken] = useState("");

    const [showProfileTab, setShowProfileTab] = useState(false);

    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers());
    }, []);



    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (authState.isTokenThere && storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
        }
    }, [authState.isTokenThere]);


    const handleSignout = () => {
        localStorage.removeItem("token");
        window.location.href = "/auth";
    }

    useEffect(() => {
        if (searchQuery === "") {
            return;
        } else {
            const filteredUsers = authState.allUsers.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filteredUsers);

        }
    }, [searchQuery]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setSearchResultsTab(false);
                setShowProfileTab(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [panelRef]);

    return (
        <div className='bg-white flex items-center justify-between px-4 md:px-20 lg:px-40 xl:px-60 border-b border-zinc-200'>
            <div className='flex items-center gap-2 md:gap-3 flex-1'>
                <img onClick={() => { router.push("/dashboard") }} className='h-8 md:h-12 cursor-pointer object-contain' src="/Synapse_logo.png" alt="logo" />
                <div className='flex items-center border border-zinc-300 rounded-3xl py-1 md:py-2 w-full max-w-[120px] sm:max-w-xs px-2 md:px-3 gap-1 md:gap-2 relative bg-zinc-50'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input className='outline-none text-[10px] md:text-sm w-full bg-transparent' placeholder='Search' value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} onClick={() => { setSearchResultsTab(true) }} />
                    {searchResultsTab === true ?
                        <div ref={panelRef} className='absolute h-80 w-[95vw] sm:w-80 md:w-120 top-12 -left-25 sm:left-0 bg-white border border-zinc-300 rounded-lg z-50 shadow-xl'>
                            <div className='flex justify-end p-2'>
                                <div className='cursor-pointer opacity-70 hover:opacity-100' onClick={() => { setSearchResultsTab(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className='overflow-y-auto w-full h-64 hide-scrollbar'>
                                {searchResults.length > 0 && (
                                    searchResults.map((user) => (
                                        <div key={user._id} className='w-full flex justify-between items-center p-3 cursor-pointer hover:bg-zinc-200 border-b border-zinc-50' onClick={() => { router.push(`/user/profile/${user._id}`) }}>
                                            <div className='flex gap-3'>
                                                <div className='pr-4'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className='text-sm  hover:text-blue-500 hover:underline' onClick={() => { router.push(`/user/profile/${user._id}`) }} >{user.name}</div>
                                                    <div className='text-xs text-zinc-600'>username: {user.username}</div>
                                                </div>
                                            </div>

                                            <div>
                                                <img className='h-8 w-8 rounded-full object-cover' src={user.profilePicture || "/default_profile.png"} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div> : null}
                </div>
            </div>
            <div className='flex gap-4 md:gap-8 lg:gap-10 items-center ml-2'>
                <div className='flex flex-col items-center text-zinc-600 cursor-pointer py-3.5 transition-all duration-200 md:flex-row md:py-3.5 md:gap-1' style={currentPage === "dashboard" ? { borderBottom: "2px solid black" } : null} onClick={() => { router.push("/dashboard") }} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <p className='hidden md:block text-[10px] md:text-[15px]  mt-1'>Home</p>
                </div>
                <div className='flex flex-col items-center text-zinc-600 cursor-pointer py-3.5 transition-all duration-200 md:flex-row md:py-3.5 md:gap-1' style={currentPage === "mynetwork" ? { borderBottom: "2px solid black" } : null} onClick={() => { router.push("/mynetwork") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <p className='hidden md:block text-[10px] md:text-[15px]  mt-1'>My Network</p>
                </div>
                <div className='relative flex items-center text-zinc-600 cursor-pointer gap-1' onClick={() => { setShowProfileTab(true) }}>
                    <div className='flex items-center justify-center w-6 h-6 md:w-7 md:h-9 border rounded-full border-zinc-300 overflow-hidden'>
                        <img className='w-full h-full object-cover' src={authState?.user?.userId?.profilePicture || "/default_profile.png"} />
                    </div>
                    <div className='flex items-center text-zinc-600 '>
                        <p>Me</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        {showProfileTab === true ? <div ref={panelRef} className='absolute min-h-90 w-60 top-15 -left-40  bg-white border border-zinc-300 rounded-lg z-50 shadow-md'>
                            <div className='p-3 py-4 '>
                                <div className='flex justify-between items-center mb-3'>
                                    <div className='flex items-center justify-center w-10 h-10 border rounded-full border-zinc-300'>
                                        <img className='rounded-full' src={authState?.user?.userId?.profilePicture || "/default_profile.png"} />
                                    </div>
                                    <div className='cursor-pointer opacity-70  hover:opacity-100' onClick={(e) => { e.stopPropagation(); setShowProfileTab(false) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                                <div className=' text-lg font-medium '>{authState?.user?.userId?.name}</div>
                                <div className='text-sm'>{authState?.user?.bio}</div>
                                <button className='border border-blue-500 h-full w-full text-sm px-8 bg-white text-blue-500 rounded-xl cursor-pointer hover:bg-blue-400 hover:text-white mt-3' onClick={() => { router.push(`/user/profile/${authState?.user?.userId?._id}`) }} >View Profile</button>
                                <div className='border border-zinc-300 mt-4'></div>
                                <div className='mt-5 cursor-pointer hover:text-black'>Settings & Privacy</div>
                                <div className='mt-2 cursor-pointer hover:text-black'>Language</div>
                                <div className='mt-2 cursor-pointer hover:text-black'>Help</div>
                                <div className='border border-zinc-300 mt-4'></div>
                                <div className='mt-2 cursor-pointer hover:text-black' onClick={handleSignout} >Sign out</div>
                            </div>
                        </div> : null}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardNavbar;