import DashboardNavbar from '@/components/Dashboard/DashboardNavbar';
import { getUserConnections } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import { connection } from 'next/server';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Connections() {
    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [token, setToken] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            dispatch(getUserConnections({ token: storedToken }));
        }
    }, [authState.isUserConnectionsFetched]);


    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(authState?.connections);
        } else {
            const filteredConnections = authState?.connections?.filter((connection) => {
                return connection.name.toLowerCase().includes(searchQuery.toLowerCase());
            });

            setSearchResults(filteredConnections);
        }
    }, [searchQuery, authState?.connections]);


    return (
        <>
            <DashboardNavbar />
            <div className='min-h-screen bg-[#F4F2EE] px-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 pt-5 pb-10 flex flex-col items-center'>
                <div className='w-full max-w-4xl bg-white border border-zinc-300 rounded-xl overflow-hidden shadow-sm'>
                    <div className='w-full bg-white border-b border-zinc-300'>
                        <div className='w-full h-14 flex items-center text-lg font-medium px-4 md:px-6'>
                            <span className='mr-2'>{authState?.connections?.length}</span>
                            Connections
                        </div>
                        <div className='w-full flex justify-end px-4 md:px-6 py-3 bg-zinc-50/50'>
                            <input className='border border-zinc-300 rounded-lg px-3 py-2 outline-none w-full sm:w-80 text-sm focus:border-blue-500 transition-all' type="text" placeholder='Search by name' value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} />
                        </div>
                    </div>
                    <div className='w-full max-h-[70vh] md:max-h-[75vh] overflow-y-auto flex flex-col'>
                        {searchResults && searchResults.length > 0 ? (
                            searchResults?.map((connection) => (
                                <div key={connection._id} className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-zinc-200 hover:bg-zinc-50 transition-colors'>
                                    <div className='flex items-center gap-3 md:gap-4 cursor-pointer w-full' onClick={() => { router.push(`/user/profile/${connection._id}`) }}>
                                        <div className='h-14 w-14 md:h-16 md:w-16 shrink-0'>
                                            <img className='h-full w-full rounded-full object-cover border border-zinc-100' src={connection.profilePicture || "/default_profile.png"} />
                                        </div>
                                        <div className='flex flex-col min-w-0'>
                                            <div className='text-sm md:text-base  hover:underline hover:text-blue-600 truncate'>{connection.name}</div>
                                            <div className='text-xs md:text-sm text-zinc-600 truncate'>{connection.username}</div>
                                        </div>
                                    </div>
                                    <div className='h-full flex items-end py-6'>
                                        <div className='mt-3 sm:mt-0 flex items-center gap-2 text-zinc-500 w-full sm:w-auto sm:justify-end'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                            </svg>
                                            <div className='text-[11px] md:text-xs text-zinc-600 truncate'>{connection.email}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-10 text-center text-zinc-500 text-sm'>
                                No connections found.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}

export default Connections;