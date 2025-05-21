import { forwardRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronUp,
} from "lucide-react";

const Footer = forwardRef((_props, ref) => {
  const [hovered, setHovered] = useState(null);

  // Physics-themed SVG background
  const PhysicsPatternSVG = () => (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="physics-grid"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1" fill="currentColor" />
          <path d="M10,0 L10,20" stroke="currentColor" strokeWidth="0.2" />
          <path d="M0,10 L20,10" stroke="currentColor" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#physics-grid)" />

      {/* Atom-like elements */}
      <circle
        cx="20"
        cy="30"
        r="3"
        fill="currentColor"
        className="opacity-20"
      />
      <ellipse
        cx="20"
        cy="30"
        rx="10"
        ry="5"
        transform="rotate(0)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <ellipse
        cx="20"
        cy="30"
        rx="10"
        ry="5"
        transform="rotate(60)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <ellipse
        cx="20"
        cy="30"
        rx="10"
        ry="5"
        transform="rotate(120)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />

      <circle
        cx="70"
        cy="60"
        r="3"
        fill="currentColor"
        className="opacity-20"
      />
      <ellipse
        cx="70"
        cy="60"
        rx="12"
        ry="6"
        transform="rotate(30)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <ellipse
        cx="70"
        cy="60"
        rx="12"
        ry="6"
        transform="rotate(90)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <ellipse
        cx="70"
        cy="60"
        rx="12"
        ry="6"
        transform="rotate(150)"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />

      {/* Wave pattern */}
      <path
        d="M0,80 Q10,75 20,80 Q30,85 40,80 Q50,75 60,80 Q70,85 80,80 Q90,75 100,80"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );

  // Custom link component with hover effect
  const FooterLink = ({ href, label, icon: Icon }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <a
        href={href}
        className="group flex items-center hover:text-blue-300 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {Icon && (
          <Icon
            size={16}
            className={`mr-2 transition-all duration-300 ${
              isHovered ? "text-blue-300" : "text-gray-400"
            }`}
          />
        )}
        <span>{label}</span>
        <span
          className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-blue-300 ml-0.5 ${
            isHovered ? "max-w-full" : "max-w-0"
          }`}
        ></span>
      </a>
    );
  };

  // Contact item component
  const ContactItem = ({ icon: Icon, text }) => (
    <div className="flex items-center text-sm text-gray-300 mb-2">
      <Icon size={16} className="mr-2 text-blue-300" />
      <span>{text}</span>
    </div>
  );

  // Social icon component with hover animation
  const SocialIcon = ({ icon: Icon, href, label }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <a
        href={href}
        aria-label={label}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon
          size={18}
          className={`transition-all duration-300 ${
            isHovered ? "scale-125" : "scale-100"
          }`}
        />
      </a>
    );
  };

  return (
    <footer
      ref={ref}
      className="bg-gradient-to-b from-[#1e2935] to-[#151f2c] text-white pt-12 pb-4 mt-auto relative overflow-hidden"
    >
      <PhysicsPatternSVG />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              {/* Logo SVG */}
              <svg
                className="w-10 h-10 mr-3"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="25" cy="25" r="5" fill="#3b82f6" />
                <ellipse
                  cx="25"
                  cy="25"
                  rx="15"
                  ry="8"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  fill="none"
                  transform="rotate(0)"
                />
                <ellipse
                  cx="25"
                  cy="25"
                  rx="15"
                  ry="8"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  fill="none"
                  transform="rotate(60)"
                />
                <ellipse
                  cx="25"
                  cy="25"
                  rx="15"
                  ry="8"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  fill="none"
                  transform="rotate(120)"
                />
              </svg>
              <div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                  SmartPhy<span className="text-blue-400">6</span>lk
                </div>
                <div className="text-xs text-gray-400">Physics Excellence</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Empowering students with comprehensive physics education and
              analytical tools for academic excellence.
            </p>
            <div className="flex space-x-3 mt-6">
              <SocialIcon icon={Facebook} href="#" label="Facebook" />
              <SocialIcon icon={Twitter} href="#" label="Twitter" />
              <SocialIcon icon={Instagram} href="#" label="Instagram" />
              <SocialIcon icon={Youtube} href="#" label="YouTube" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-500 mr-2 rounded-sm"></span>
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink href="#about" label="About Us" />
              </li>
              <li>
                <FooterLink href="#services" label="Our Services" />
              </li>
              <li>
                <FooterLink href="#classes" label="Class Schedule" />
              </li>
              <li>
                <FooterLink href="#testimonials" label="Success Stories" />
              </li>
              <li>
                <FooterLink href="#faq" label="FAQs" />
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-500 mr-2 rounded-sm"></span>
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink href="#blog" label="Physics Blog" />
              </li>
              <li>
                <FooterLink href="#papers" label="Past Papers" />
              </li>
              <li>
                <FooterLink href="#materials" label="Study Materials" />
              </li>
              <li>
                <FooterLink href="#videos" label="Tutorial Videos" />
              </li>
              <li>
                <FooterLink href="#analysis" label="Performance Analytics" />
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-500 mr-2 rounded-sm"></span>
              Contact Us
            </h3>
            <div className="space-y-2">
              <ContactItem
                icon={MapPin}
                text="123 Education Ave, Colombo, Sri Lanka"
              />
              <ContactItem icon={Phone} text="+94 77 123 4567" />
              <ContactItem icon={Mail} text="info@smartphy6lk.com" />
            </div>

            <div className="mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105">
                Contact Us
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-8">
              <h4 className="text-lg font-semibold mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-300">
                Subscribe to our newsletter for physics tips and resources
              </p>
            </div>
            <div className="flex flex-1 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SmartPhy6lk. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <a
              href="#"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              Cookies Policy
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
});

export default Footer;
