import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SignInPanel from './SignInPanel';
import BottomNavBar from './BottomNavBar';
import SearchSidebar from '../components/SearchSidebar';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [searchOpen, setSearchOpen] = useState(false);
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
            <div className="fixed bottom-0 left-0 right-0 z-0 block lg:hidden">
                <BottomNavBar
        onAccountClick={() => {}}
        onSearchClick={() => setSearchOpen(true)}
      />
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>

        </div>
    );
};

export default Layout;
