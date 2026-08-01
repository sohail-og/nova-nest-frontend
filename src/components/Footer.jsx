import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] border-t border-decor-cream/20 text-[#a39f99] py-20 px-6 font-light">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="space-y-6">
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.25em] font-light text-white">
              NOVA<span className="text-decor-gold">NEST</span>
            </span>
            <span className="text-[8px] tracking-[0.45em] font-light text-[#7a7670] uppercase -mt-1">
              Bespoke Living
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-[#7a7670] max-w-sm">
            Curators of high-end home interiors, lighting, and bespoke decor. Bringing timeless heritage design, organic stone textures, and artisanal details to modern homes.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-[#7a7670] hover:text-decor-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="text-[#7a7670] hover:text-decor-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="text-[#7a7670] hover:text-decor-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Collections Links */}
        {/* <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Spaces</h4>
          <ul className="space-y-3 text-xs">
            <li>
              <Link to="/products" className="hover:text-decor-gold transition-colors">The Living Room</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-decor-gold transition-colors">The Dining Space</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-decor-gold transition-colors">Architectural Lighting</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-decor-gold transition-colors">Decor & Accessories</Link>
            </li>
          </ul>
        </div> */}

        {/* Client Services */}
        {/* <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Bespoke Styling</h4>
          <ul className="space-y-3 text-xs">
            <li>
              <a href="#" className="hover:text-decor-gold transition-colors">Interior Design Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-decor-gold transition-colors">Stone & Wood Care Guide</a>
            </li>
            <li>
              <a href="#" className="hover:text-decor-gold transition-colors">White Glove Delivery</a>
            </li>
            <li>
              <a href="#" className="hover:text-decor-gold transition-colors">The Designer Trade Program</a>
            </li>
          </ul>
        </div> */}

        {/* Newsletter Signup
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">The Collector's List</h4>
          <p className="text-xs text-[#7a7670] leading-relaxed">
            Subscribe to receive private invitations to seasonal collections, editorial lookbooks, and design previews.
          </p>
          <form className="relative flex items-center border-b border-decor-gold/20 py-2 focus-within:border-decor-gold/60 transition-colors">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border-none text-xs text-white placeholder-[#555350] focus:outline-none w-full pr-8"
            />
            <button type="submit" className="absolute right-0 text-decor-gold hover:text-decor-gold-light transition-colors">
              <ArrowRight size={16} />
            </button>
          </form>
        </div> */}

      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-wider text-[#7a7670]">
        <p>&copy; {new Date().getFullYear()} NOVA NEST. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-decor-gold">Privacy Policy</a>
          <a href="#" className="hover:text-decor-gold">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
