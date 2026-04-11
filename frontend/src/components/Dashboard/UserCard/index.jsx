import { getAboutUser } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function UserCard() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const [token, setToken] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const storedToken = (localStorage.getItem("token"));
        setToken(storedToken);
        if (authState.isTokenThere && storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
        }
    }, [authState.isTokenThere]);

    return (
        <>

            <div className='min-h-65 w-full rounded-lg border border-zinc-300 bg-white relative shadow-sm cursor-pointer pb-2' onClick={() => {
                if (authState?.user?.userId?._id) {
                    router.push(`/user/profile/${authState.user.userId._id}`);
                }
            }} >
                <div className="h-20 w-full rounded-t-lg bg-cover border-b border-zinc-300">
                    <img className='h-full w-full' src={authState?.user?.userId?.bannerImage || "/banner_image.png"} />
                </div>
                <div className='h-20 w-20 relative left-4 -top-10 '>
                    <img className='rounded-full border border-3 border-white bg-cover' src={authState?.user?.userId?.profilePicture || "/default_profile.png"} alt="" />
                </div>
                <div className='px-3'>
                    <div className='text-lg'>{authState?.user?.userId?.name}</div>
                    <div className='text-xs pb-2'>{authState?.user?.bio}</div>
                    <div className='text-sm'>{authState?.user?.currentPost}</div>
                </div>
            </div>
        </>
    )
}

export default UserCard;