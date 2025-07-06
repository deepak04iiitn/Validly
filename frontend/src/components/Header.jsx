import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center cursor-pointer">
            <img
              src="/Validly.png"
              alt="Validly Logo"
              className="w-24 h-20 object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#ideas" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Ideas</a>
            <a href="#collaborate" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Collaborate</a>
            <a href="#mentorship" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Mentorship</a>
            <a href="#communities" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Communities</a>
            <a href="#progress" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Progress</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold cursor-pointer">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 space-y-4">
            <a href="#ideas" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Ideas</a>
            <a href="#collaborate" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Collaborate</a>
            <a href="#mentorship" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Mentorship</a>
            <a href="#communities" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Communities</a>
            <a href="#progress" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Progress</a>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold cursor-pointer text-center">
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}