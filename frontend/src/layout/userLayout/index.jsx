import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react'

function UserLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

export default UserLayout;