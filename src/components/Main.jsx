import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Main({ children }) {
    return (
        <div className="layout_principal">
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default Main;