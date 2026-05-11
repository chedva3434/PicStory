import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer1 from './footer';

const Layout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer1 /> 
    </div>
  );
};

export default Layout;
