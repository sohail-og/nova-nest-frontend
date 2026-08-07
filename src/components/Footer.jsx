
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-decor-beige border-t border-decor-cream text-decor-stone py-16 px-6 font-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-center md:text-left">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <Link to="/" className="flex flex-col items-center md:items-start">
            <span className="font-serif text-2xl tracking-[0.25em] font-light text-decor-black">
              NOVA<span className="text-decor-gold">NEST</span>
            </span>
            <span className="text-[8px] tracking-[0.45em] font-light text-decor-stone uppercase -mt-1">
              Bespoke Living
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-decor-stone max-w-sm">
            Curators of high-end home interiors, lighting, and bespoke decor. Bringing timeless heritage design and organic textures to modern residential spaces.
          </p>
        </div>

        {/* Legal Links & Copyright */}
        <div className="flex flex-col items-center md:items-end space-y-4 text-[10px] tracking-wider text-decor-stone">
          <div className="flex space-x-8">
            <a href="#" className="hover:text-decor-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-decor-gold transition-colors">Terms of Service</a>
          </div>
          <p>&copy; {new Date().getFullYear()} NOVANEST. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
