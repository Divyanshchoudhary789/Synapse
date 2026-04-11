import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";

function Footer() {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-between bg-gray-100 w-full h-auto p-6 md:p-10">
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 md:px-10 lg:px-20'>
                <div className='flex h-full w-full lg:w-40 justify-start lg:justify-around items-center text-4xl gap-6 lg:gap-0' >
                    <Link href="https://www.linkedin.com/in/divyansh--choudhary/"><FaLinkedin className='hover:scale-90 transition-transform cursor-pointer' /></Link>
                    <Link href="https://github.com/Divyanshchoudhary789" ><FaGithubSquare className='hover:scale-90 transition-transform cursor-pointer' /></Link>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-20 w-full lg:w-auto'>
                    <div className='flex flex-col gap-2'>
                        <div className='font-bold text-gray-800 mb-1'>General</div>
                        <Link href={"/auth"} ><div className='text-zinc-500 text-sm hover:underline'>Sign Up</div></Link>
                        <Link href={"/about"}><div className='text-zinc-500 text-sm hover:underline'>About</div></Link>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Help Center</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Blog</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Careers</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='font-bold text-gray-800 mb-1'>Browse Synapse</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Learning</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Jobs</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Games</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Mobile</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Services</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='font-bold text-gray-800 mb-1'>Directories</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Members</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Jobs</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Companies</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Featured</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Learning</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='font-bold text-gray-800 mb-1'>Business Solutions</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Talent</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Marketing</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Sales</div>
                        <div className='text-zinc-500 text-sm hover:underline cursor-pointer'>Learning</div>
                    </div>
                </div>
            </div>
            <div className='w-full border-t border-zinc-300 my-8'></div>
            <div className='flex flex-col xl:flex-row items-center justify-between gap-6 md:px-10'>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <img className="h-12 md:h-16 lg:h-20 cursor-pointer" src="/Synapse_logo.png" alt="" onClick={() => { router.push("/") }} />
                    <div className="text-sm md:text-md text-zinc-600">&copy; 2026 All Rights Reserved.</div>
                </div>
                <div className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
                    <Link href={"/about"}><div className='text-zinc-500 text-[10px] md:text-xs hover:underline'>About</div></Link>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Accessibility</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>User Agreement</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Privacy Policy</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Cookie Policy</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Copyright Policy</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Brand Policy</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Guest Controls</div>
                    <div className='text-zinc-500 text-[10px] md:text-xs hover:underline cursor-pointer'>Community Guidelines</div>
                </div>
            </div>
        </div>
    )
}

export default Footer;