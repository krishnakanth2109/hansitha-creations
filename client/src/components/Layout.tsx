import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SignInPanel from './SignInPanel';
import BottomNavBar from './BottomNavBar';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openSignIn = () => {
        setIsSignInOpen(true);
        setIsSidebarOpen(false);
    };
    const closeSignIn = () => setIsSignInOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header onMenuClick={openSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLoginClick={openSignIn} />
            <SignInPanel isOpen={isSignInOpen} onClose={closeSignIn} />

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
            )}
            {isSignInOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSignIn} />
            )}

            <main>{children}</main>
            <BottomNavBar onAccountClick={openSignIn} />

        </div>
    );
};

export default Layout;
