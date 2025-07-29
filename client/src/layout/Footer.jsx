import React from 'react';
import {
  FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';



const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("🎉 Subscribed successfully!");
  };

  return (
    <footer className="bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] border-t text-gray-700">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12">

        {/* Header Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400">
            Explore JobFinder
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Your gateway to career opportunities and hiring solutions
          </p>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className=" bg-gradient-to-r from-pink-400 to-orange-300 font-bold p-2 rounded">JF</div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 ">JobFinder</h2>
            </div>
            <p className="text-sm">
              Connecting talented professionals with amazing opportunities. Find your dream job or hire the perfect candidate with our job board platform.
            </p>
            <div className="flex gap-3 mt-4">
              <FaLinkedin aria-label="LinkedIn" className="w-6 h-6 text-gray-600 hover:text-orange-500 hover:scale-110 transition-transform" />
              <FaTwitter aria-label="Twitter" className="w-6 h-6 text-gray-600 hover:text-orange-500 hover:scale-110 transition-transform" />
              <FaFacebook aria-label="Facebook" className="w-6 h-6 text-gray-600 hover:text-orange-500 hover:scale-110 transition-transform" />
              <FaInstagram aria-label="Instagram" className="w-6 h-6 text-gray-600 hover:text-orange-500 hover:scale-110 transition-transform" />
              <FaYoutube aria-label="YouTube" className="w-6 h-6 text-gray-600 hover:text-orange-500 hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Column 2: Job Links */}
          <div>
            <h3 className="font-semibold mb-3">Job Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobCardGrid" className="hover:text-orange-500">Browse Jobs</Link></li>
              <li><Link to="/category" className="hover:text-orange-500">Category</Link></li>
             
              <li><Link to="/advice" className="hover:text-orange-500">Advice</Link></li>
             
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="font-semibold mb-3">Stay Updated</h3>
            <p className="text-sm mb-3">
              Get the latest job opportunities and hiring tips directly in your inbox.
            </p>
            <form className="flex w-full max-w-sm rounded-l-full rounded-r-full shadow-sm" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-400 to-orange-3000  px-5 py-2 rounded-r-full hover:bg-orange-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Lower Links */}
        <div className="border-t mt-10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/media">Media</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/partnerships">Partnerships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Trusted By</h4>
            <ul className="space-y-1">
              <li><Link to="/security">Secure Platform</Link></li>
              <li><Link to="/partners">10k+ Companies</Link></li>
              <li><Link to="/reach">Global Reach</Link></li>
              <li><Link to="/enterprise">Enterprise Hiring</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 space-y-2 md:space-y-0">
          <p>© 2025 JobFinder. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-orange-500">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-500">Terms</Link>
            <Link to="/cookies" className="hover:text-orange-500">Cookies</Link>
            <Link to="/accessibility" className="hover:text-orange-500">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
