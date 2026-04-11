import CreatePost from '@/components/Dashboard/CreatePost';
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar';
import UserCard from '@/components/Dashboard/UserCard';
import Feed from '@/components/Dashboard/Feed';
import { getAboutUser } from '@/config/redux/action/authAction';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import Link from 'next/link';

function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const [token, setToken] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.push("/auth");
        } else {
            dispatch(setTokenIsThere());
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (authState.isTokenThere && storedToken) {
            dispatch(getAboutUser({ token: storedToken }));
        }

    }, [authState.isTokenThere]);

    useEffect(() => {
        setProfilePicture(authState?.user?.userId?.profilePicture);
        setName(authState?.user?.userId?.name);
    }, [authState.user]);


    return (
        <>
            <DashboardNavbar />
            <div className='min-h-screen w-full bg-[#F4F2EE] px-4 md:px-10 lg:px-20 xl:px-72 pt-5'>
                <div className='flex flex-col md:flex-row gap-5 '>
                    <div className='w-full md:w-1/4 lg:w-1/5'>
                        <UserCard />
                    </div>
                    <div className='flex flex-col gap-3 w-full md:flex-1 lg:w-2/4 h-screen overflow-y-auto hide-scrollbar'>
                        <CreatePost profilePicture={profilePicture} name={name} />
                        <div className='w-full border border-zinc-400'></div>
                        <Feed userPicture={profilePicture} />
                    </div>
                    <div className='hidden lg:block lg:w-3/12 h-200'>
                        <div className='w-full h-auto rounded-lg border border-zinc-300 bg-white shadow-sm p-4'>
                            <div className='font-medium'>Developer Info</div>
                            <div className='text-lg mt-3 font-medium'>Divyansh Choudhary</div>
                            <div className='text-sm'>BCA(AI & IOT) Student @ICFAI UNIVERSITY JAIPUR</div>
                            <div className='text-sm mt-2'>MERN Stack Developer</div>
                            <div className='mt-4'>Contact:</div>
                            <div className='text-xs mt-2'>Email: divyanshchoudhary789@gmail.com</div>
                            <div className='flex mt-10 gap-4'>
                                <Link href="https://www.linkedin.com/in/divyansh--choudhary/"><FaLinkedin className='text-4xl hover:scale-90' /></Link>
                                <Link href="https://github.com/Divyanshchoudhary789"><FaGithubSquare className='text-4xl hover:scale-90' /></Link>
                            </div>

                        </div>
                        <div className='w-full h-20 rounded-lg  bg-transparent flex mt-2'>
                            <img className='h-10 w-25' src="/Synapse_logo.png" />
                            <div className='text-xs mt-2.5'>Synapse Corporations &copy;2026</div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Dashboard;