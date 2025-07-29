import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="max-w-[1200px] mx-auto" >
      <Header />
      
      <main className="max-w-[1200px] mx-auto" >
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
