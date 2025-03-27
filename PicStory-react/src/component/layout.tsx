import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet מציג את התוכן של העמוד הנוכחי
import Header from './header';

const Layout: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet /> {/* מציג את התוכן של כל דף */}
            </main>
        </div>
    );
};

export default Layout;
