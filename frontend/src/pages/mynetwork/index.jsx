import DashboardNavbar from '@/components/Dashboard/DashboardNavbar';
import { acceptConnectionRequest, getAboutUser, getAllUsers, getConnectionRequestsToApprove, getUserConnections, sendConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import { connection } from 'next/server';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function MyNetwork() {
    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [token, setToken] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            dispatch(getUserConnections({ token: storedToken }));
        }
    }, [authState.isUserConnectionsFetched]);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
            //console.log(authState.user)

        }
    }, [authState.profileFetched]);

    useEffect(() => {
        dispatch(getAllUsers());


    }, [authState?.allUsersFetched]);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        dispatch(getConnectionRequestsToApprove({ token: storedToken }));


    }, [authState.isRequestsToApproveFetched, authState.isRequestApproved]);


    useEffect(() => {
        if (authState?.allUsers && authState?.connections && authState?.user?.userId?._id && authState?.connectionRequests) {

            const my_id = authState?.user?.userId?._id;
            const connectionIds = authState?.connections?.map((connection) => connection._id);
            const invitationRequestUserIds = authState?.connectionRequests?.map((req) => req?.userId?._id);

            const filteredUsers = authState?.allUsers.filter((user) => (
                user._id !== my_id && !connectionIds.includes(user._id) && !invitationRequestUserIds.includes(user._id)
            ));

            //console.log(filteredUsers);
            setFilteredUsers(filteredUsers);
        }
    }, [authState.allUsers, authState.connections, authState.user, authState?.connectionRequests]);



    const handleConnectionRequest = (connectionId) => {
        dispatch(sendConnectionRequest({ token, connectionId }));
    }


    const handleAcceptRequest = (requestId) => {
        dispatch(acceptConnectionRequest({ token, requestId }));
    }


    return (
        <div className="min-h-screen bg-[#F4F2EE]">
            <DashboardNavbar />


            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-80 shrink-0'>
                    <div className='w-full border border-zinc-300 rounded-xl shadow-sm flex flex-col bg-white overflow-hidden'>
                        <div className='w-full h-13 px-4 border-b border-zinc-300 flex items-center text-md font-medium py-3'>Manage my network</div>

                        <div className='w-full flex flex-col '>
                            <div className='flex gap-2 px-4 bg-white h-12 items-center justify-between cursor-pointer hover:bg-zinc-100' onClick={() => { router.push("/mynetwork/connections") }} >
                                <div className='flex items-center gap-2 h-full' >
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                    </div>
                                    <div className='text-md'>Connections</div>
                                </div>
                                <div>{authState?.connections?.length}</div>
                            </div>

                            <div className='flex gap-2 px-4 bg-white  h-12 items-center cursor-pointer hover:bg-zinc-100'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                                <div className='text-md'>Following & Followers</div>
                            </div>

                            <div className='flex gap-2 px-4 bg-white h-12 items-center cursor-pointer hover:bg-zinc-100'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                    </svg>
                                </div>
                                <div className='text-md'>Groups</div>
                            </div>

                            <div className='flex gap-2 px-4  bg-white h-12 items-center cursor-pointer hover:bg-zinc-100'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>
                                </div>
                                <div className='text-md'>Events</div>
                            </div>

                            <div className='flex gap-2 px-4 bg-white h-12 items-center cursor-pointer hover:bg-zinc-100'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                    </svg>
                                </div>
                                <div className='text-md'>Pages</div>
                            </div>

                            <div className='flex gap-2 px-4 bg-white h-12 items-center cursor-pointer rounded-b-xl hover:bg-zinc-100'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                    </svg>
                                </div>
                                <div className='text-md'>Newsletters</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1  overflow-y-scroll hide-scrollbar '>
                    <div className='w-full h-100 mb-5 border border-zinc-300 rounded-xl shadow-md flex flex-col '>
                        <div className='w-full h-12 bg-white rounded-t-xl border-b border-zinc-300 flex items-center px-5 text-lg text-zinc-500'>
                            Invitations
                            <span className='ml-2'>({authState?.connectionRequests?.length})</span>
                        </div>
                        <div className='w-full flex-1 bg-white py-1 flex flex-col gap-1 overflow-y-scroll '>
                            {authState?.connectionRequests?.map((req) => (
                                <div key={req._id} className='w-full h-20 bg-white border border-zinc-300 flex items-center px-4 justify-between hover:bg-zinc-100'>
                                    <div className='flex items-center gap-3 cursor-pointer' onClick={() => { router.push(`/user/profile/${req?.userId?._id}`) }}>
                                        <div className='h-15 w-15 rounded-full'>
                                            <img className='h-full w-full rounded-full' src={req?.userId?.profilePicture || "/default_profile.png"} />
                                        </div>
                                        <div>
                                            <div className='text-md hover:underline hover:text-blue-500 line-clamp-1'>{req?.userId?.name}</div>
                                            <div className='text-sm text-zinc-500 line-clamp-1'>{req?.userId?.username}</div>
                                        </div>
                                    </div>
                                    <div className='h-full w-40 flex items-center justify-center'>
                                        <button className='h-10 w-25 border border-blue-500 text-sm cursor-pointer rounded-full text-blue-500 bg-white hover:bg-blue-100 hover:scale-95 hover:border-2' onClick={() => { handleAcceptRequest(req?._id) }} >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full bg-white border border-zinc-300 rounded-xl shadow-md grid grid-cols-1 pl-[18%] sm:grid-cols-2 sm:pl-3 md:grid-cols-3 md:pl-3 xl:grid-cols-3 xl:pl-3 gap-4 p-3 mb-50'>
                        {filteredUsers?.map((user) => (
                            <div key={user._id} className='h-70 w-60 border border-zinc-300 rounded-xl bg-white flex flex-col'>
                                <div className='w-full h-15'>
                                    <img className='rounded-t-xl' src={user?.bannerImage || "/banner_image.png"} />
                                </div>
                                <div className='w-25 h-25 rounded-full relative -top-8 left-16 cursor-pointer' onClick={() => { router.push(`/user/profile/${user?._id}`) }}>
                                    <img className='w-full h-full rounded-full object-cover mx-auto' src={user?.profilePicture || "/default_profile.png"} />
                                </div>
                                <div className='flex flex-col items-center relative -top-6'>
                                    <div className='text-md line-clamp-1'>{user?.name}</div>
                                    <div className='text-xs text-zinc-500 line-clamp-1'>{user?.username}</div>
                                    <div className='text-xs text-zinc-500 line-clamp-1'>{user?.email}</div>
                                </div>
                                <div className='w-full h-15 flex justify-center items-center'>
                                    <button className='border border-blue-500 text-blue-500 px-8 py-2 rounded-full flex gap-1 text-sm cursor-pointer hover:bg-blue-100 hover:scale-95 hover:border-2' onClick={() => { handleConnectionRequest(user._id) }} >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                            <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                                        </svg>
                                        <span>Connect</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



        </div>
    )
}

export default MyNetwork;