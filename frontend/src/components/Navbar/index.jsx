import { useRouter } from 'next/router';
import React, { useState } from 'react'

function Navbar() {
    const router = useRouter();
    const path = router.asPath;
    const currentPage = path.split("/")[1];

    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/", id: "" },
        { name: "About Us", path: "/about", id: "about" }
    ];

    return (
        <nav className="flex justify-between items-center px-6 md:px-20 lg:px-50 sticky top-0 bg-white z-50 shadow-sm">
            <div className="logo cursor-pointer" onClick={() => { router.push("/") }}>
                <img className="h-12 md:h-16 lg:h-20" src="/Synapse_logo.png" alt="logo" />
            </div>

            {/* desktop links */}
            <div className="hidden md:flex gap-x-8">
                {navLinks.map((link) => (
                    <div
                        key={link.id}
                        className="text-lg lg:text-xl cursor-pointer pb-1 transition-all"
                        style={currentPage === link.id ? { borderBottom: "2px solid black" } : null}
                        onClick={() => router.push(link.path)}
                    >
                        {link.name}
                    </div>
                ))}
            </div>

            {/* --- Desktop Action Button --- */}
            <div className="hidden md:block bg-blue-500 text-white py-2 lg:py-3 rounded-3xl px-5 cursor-pointer hover:scale-95 transition-transform"
                onClick={() => router.push("/auth")} >
                Create Account
            </div>

            {/* --- Mobile Hamburger Icon --- */}
            <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                </svg>
            </div>

            {/* --- Mobile Drawer (Menu) --- */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 flex flex-col items-center gap-y-6 py-8 md:hidden shadow-lg animate-in fade-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <div
                            key={link.id}
                            className="text-xl font-medium"
                            onClick={() => {
                                router.push(link.path);
                                setIsOpen(false);
                            }}
                        >
                            {link.name}
                        </div>
                    ))}
                    <div className="bg-blue-500 text-white py-3 rounded-3xl px-8 cursor-pointer"
                        onClick={() => {
                            router.push("/auth");
                            setIsOpen(false);
                        }} >
                        Create Account
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;