import React from 'react';
import { Lightbulb, Globe, MessageCircle, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Company Info */}
          <div className="flex flex-col items-start md:items-center mb-8 md:mb-0">
            <a href="/" className="flex items-center mb-4 cursor-pointer">
              <img
                src="/Validly.png"
                alt="Validly Logo"
                className="w-28 h-24 object-contain drop-shadow-lg"
              />
            </a>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base max-w-xs text-left md:text-center">
              The social platform for startup builders. Validate ideas, find collaborators, and build communities around your startups.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Globe className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Users className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide uppercase">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Integrations</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide uppercase">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Templates</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide uppercase">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm md:text-base">
              © 2025 Validly. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-2 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}