import UserLayout from '@/layout/userLayout';
import { useRouter } from 'next/router';
import React from 'react'

function AboutPage() {
    const router = useRouter();
    return (
        <UserLayout>
            <div className="flex flex-col items-center h-auto w-full px-6 md:px-20 lg:px-50">
                <div className="flex flex-col md:flex-row items-center py-10 md:py-20 gap-10" >
                    <div className='text-center md:text-left order-2 md:order-1'>
                        <div className="text-3xl md:text-5xl font-medium my-2 md:my-4">Welcome to your</div>
                        <div className="text-3xl md:text-5xl font-medium mb-3">professional community</div>
                        <p className="text-base md:text-lg text-zinc-600">Join your colleagues, classmates, and friends on Synapse</p>
                        <div className="bg-blue-500 text-white py-3 md:py-4 rounded-3xl px-6 my-6 cursor-pointer text-center w-full md:w-80 mx-auto md:mx-0 hover:scale-95 transition-transform" onClick={() => { router.push("/auth") }}>
                            Get Started
                        </div>
                    </div>
                    <div className='order-1 md:order-2 w-full md:w-auto'>
                        <img className="h-auto max-h-[300px] md:h-120 w-full object-contain" src="/about_image.jpg" alt="about-image" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 pb-20" >
                    <div className='w-full md:w-auto'>
                        <img className="h-auto max-h-[300px] md:h-120 w-full object-contain" src="/about_image02.jpg" alt="about-image" />
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-3xl md:text-5xl font-medium my-2 md:my-4">Connect and Discuss</div>
                        <div className="text-3xl md:text-5xl font-medium mb-3">with thousands of people</div>
                        <p className="text-base md:text-lg text-zinc-600">Join your colleagues, classmates, and friends on Synapse</p>
                        <div className="bg-blue-500 text-white py-3 md:py-4 rounded-3xl px-6 my-6 cursor-pointer text-center w-full md:w-80 mx-auto md:mx-0 hover:scale-95 transition-transform" onClick={() => { router.push("/auth") }}>
                            Get Started
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default AboutPage;