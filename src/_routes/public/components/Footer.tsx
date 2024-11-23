import { forwardRef } from "react";

const Footer = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <footer ref={ref} className="bg-[#1e2935] text-white py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo or Brand Name */}
          <div className="text-xl font-semibold">SmartPhy6lk</div>

          {/* Links Section */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-6 text-sm ">
            <a href="#" className="hover:text-gray-400 transition text-white">
              About Us
            </a>
            <a href="#" className="hover:text-gray-400 transition text-white">
              Services
            </a>
            <a href="#" className="hover:text-gray-400 transition text-white">
              Blog
            </a>
            <a href="#" className="hover:text-gray-400 transition text-white">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 border-t border-gray-700 pt-2">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
